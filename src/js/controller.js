import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
// //https://forkify-api.herokuapp.com/api/v2/key
// // {
// // "status": "success",
// // "data": {
//     "createdAt": "2025-09-02T21:16:12.024Z",
//     "_id": "68b81151d30dd20015ca2729",
//     "key": "1ebce0b4-703a-444b-a6e0-f67c8bfb105a",
//     "__v": 0,
//     "id": "68b81151d30dd20015ca2729"
// //  }
// // }
///////////////////////////////////////

const recipeController = async function () {
  try {
    //Get id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //Get api key
    await model.loadApiKey();

    if (!model.state.apiKey) throw new Error('Cannot get api key.');

    //Loading recipe
    await model.loadRecipe(id, model.state.apiKey);

    //Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log('Error fetching recipe: ', err);
  }
};

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, recipeController)
);
