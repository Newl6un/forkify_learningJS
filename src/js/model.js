import { API_KEY, API_URL, API_KEY_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  apiKey: '',
};

export const loadRecipe = async function (id) {
  try {
    if (!state.apiKey) throw new Error('Api key required.');

    const data = await getJSON(`${API_URL}/${id}?key=${state.apiKey}`);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    console.error('Fail when load recipe: ', error);
    throw error;
  }
};

const _getApiKeyFromApi = async function () {
  try {
    const data = await getJSON(API_KEY_URL);

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
    if (!state.apiKey) throw new Error('Api key required.');

    const data = await getJSON(
      `${API_URL}?search=${query}&key=${state.apiKey}`
    );

    state.search.query = query;

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    console.error('Failed when search: ', error);
    throw error;
  }
};

export const getSearchResulsPage = function (page = 1) {
  state.search.page = page;
  const resultPerPage = state.search.resultPerPage;
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;

  return state.search.results.slice(start, end);
};
