import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js'; //polyfilling everything > es6
import 'regenerator-runtime/runtime'; //polyfilling async/await

//This is from Parcel (hot module reloading), when modify code, the initial state of page remain, ex cu recipies pizza
if (module.hot) {
  module.hot.accept();
}

// import icons from '../img/icons.svg'; //Parcel 1

// console.log(icons);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//289. Get Recipe from API

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //fara #
    // console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    //0) Update results view to mark selected search result(recipe), is active link =link in url
    resultsView.update(model.getSearchResultsPage());

    //1).Update bookmarks view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    //2).Loading recipe
    await model.loadRecipe(id);

    //3). 290. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4). Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) Render NEW results

  resultsView.render(model.getSearchResultsPage(goToPage));

  //2). Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //Update the recipe servings (in the state)
  model.updateServigs(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1). Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3).Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Display a success message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //allows change url withou loading the page!
    // window.history.back(); //automatically going back to the last page!
  } catch (err) {
    console.error('💣💣🙋‍♀️', err);
    addRecipeView.renderError(err.message);
  }
};

//Publisher-Subscriber Pattern!
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
