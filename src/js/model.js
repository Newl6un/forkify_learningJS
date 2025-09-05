import {
  API_KEY,
  API_URL,
  API_KEY_URL,
  RES_PER_PAGE,
  BOOK_MARKS,
} from './config.js';
import { AJAX, isObjectEmpty } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  apiKey: '',
  bookmarks: {},
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: Object.hasOwn(state.bookmarks, recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${state.apiKey}`);

    state.recipe = createRecipeObject(data);
  } catch (error) {
    console.error('Fail when load recipe: ', error);
    throw error;
  }
};

const _getApiKeyFromApi = async function () {
  try {
    const data = await AJAX(API_KEY_URL);

    const { key } = data.data;

    state.apiKey = key;
  } catch (error) {
    console.error('Failed when get api key: ', error);
    state.apiKey = '';
    throw error;
  } finally {
    localStorage.setItem(API_KEY, state.apiKey);
  }
};

export const loadApiKey = async function (reload = false) {
  const result = localStorage.getItem(API_KEY);

  if (result && !reload) {
    state.apiKey = result;
    return;
  }

  await _getApiKeyFromApi();
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${state.apiKey}`);

    state.search.query = query;

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    console.error('Failed when search: ', error);
    throw error;
  }
};

export const getSearchResulsPage = function (page = state.search.page) {
  state.search.page = page;
  const resultPerPage = state.search.resultPerPage;
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    //new quantity = old quantity * newServings / oldServings
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem(BOOK_MARKS, JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (Object.hasOwn(state.bookmarks, recipe.id)) {
    return;
  }
  state.bookmarks[recipe.id] = recipe;

  //Mark current recipe as bookmarks
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  delete state.bookmarks[id];

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

export const loadBookMark = function () {
  const storage = localStorage.getItem(BOOK_MARKS);
  if (storage && !isObjectEmpty(storage)) {
    const bookmarks = JSON.parse(storage);

    state.bookmarks = bookmarks;
  }
};

export const uploadRecipe = async function (recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .map(ing => {
        const [quantity, unit, description] = ing[1]
          .split(',')
          .map(el => el.trim());

        return {
          quantity: quantity ? +quantity : null,
          unit: unit ?? '',
          description: description ?? '',
        };
      });

    const newRecipe = {
      title: recipe.title,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      publisher: recipe.publisher,
      cooking_time: +recipe.cookingTime,
      servings: +recipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${state.apiKey}`, newRecipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    console.error('Failed when uploadRecipe: ', error);
    throw error;
  }
};

const init = async function () {
  await loadApiKey();
  loadBookMark();
};

init();

//For test
const clearBookmarks = function () {
  localStorage.clear(BOOK_MARKS);
};
