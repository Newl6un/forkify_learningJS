import { API_KEY, API_URL, API_KEY_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {},
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
    console.log('Fail when load recipe: ', error);
    throw error;
  }
};

const _getApiKeyFromApi = async function () {
  try {
    const data = await getJSON(API_KEY_URL);

    const { key } = data.data;

    state.apiKey = key;
  } catch (error) {
    console.log('Failed when get api key: ', error);
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
