import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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

if (module.hot) {
  module.hot.accept();
}

const recipeController = async function () {
  try {
    //Get id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //Update results view to mark selected search result
    resultsView.update(model.getSearchResulsPage());

    bookmarksView.update(Object.values(model.state.bookmarks));

    //Loading recipe
    await model.loadRecipe(id, model.state);

    //Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error('Error fetching recipe: ', err);
    recipeView.renderMessage();
  }
};

const searchController = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();

    if (!query) {
      resultsView.renderError();
      return;
    }

    //2. Load search results
    await model.loadSearchResults(query);

    //3. Render results
    resultsView.render(model.getSearchResulsPage());

    //4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error('Error search recipe: ', err);
    resultsView.renderError();
  }
};

const paginationController = function (gotoPage) {
  //3. Render results
  resultsView.render(model.getSearchResulsPage(gotoPage));

  //4. Render initial pagination button
  paginationView.render(model.state.search);
};

const servingsController = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const bookmarkController = function () {
  if (model.state.recipe && Object.keys(model.state.recipe).length !== 0) {
    // Add/Remove bookmark
    if (!model.state.recipe.bookmarked) {
      model.addBookmark(model.state.recipe);
    } else {
      model.deleteBookmark(model.state.recipe.id);
    }

    //Update recipe view
    recipeView.update(model.state.recipe);
  }

  bookmarksView.render(Object.values(model.state.bookmarks));
};

const addRecipeController = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.update(Object.values(model.state.bookmarks));

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('Error addRecipe: ', error);
    addRecipeView.renderError();
  }
};

const init = async function () {
  // if (location.hash) {
  //   history.replaceState(null, '', location.pathname + location.search);
  // }
  bookmarksView.addHandlerRender(bookmarkController);
  recipeView.addHandlerRender(recipeController);
  recipeView.addHandlerUpdateServings(servingsController);
  recipeView.addHandlerAddBookmark(bookmarkController);
  searchView.addHandlerSearch(searchController);
  paginationView.addHandlerClick(paginationController);
  addRecipeView.addHandlerUpload(addRecipeController);
};

init();
