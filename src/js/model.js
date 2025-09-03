import { async } from 'regenerator-runtime';

const API_KEY = 'apiKey';
export const state = {
  recipe: {},
  search: {},
  apiKey: '',
};

export const loadRecipe = async function (id, apiKey) {
  try {
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes/${id}?key=${apiKey}`
    );

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

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
  }
};

const _getApiKeyFromApi = async function () {
  try {
    const res = await fetch('https://forkify-api.herokuapp.com/api/v2/key');
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const { key } = data.data;

    state.apiKey = key;
  } catch (error) {
    console.log('Failed when get api key: ', error);
    state.apiKey = '';
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
