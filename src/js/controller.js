import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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

    //Loading recipe
    await model.loadRecipe(id, model.state);

    //Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log('Error fetching recipe: ', err);
  }
};

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, recipeController)
);
