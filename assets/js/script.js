// Event listener on nav link to show Recipe Sections
$("#recipeNavigation").on("click", function () {
  $("#recipe-search-section").removeClass("d-none");
  $("#nutritional-analysis-container").addClass("d-none");
  // Clear the ingredients search
  $("#searchRecipes").addClass("d-none");
  $("#recipe-results").empty();
  $("#recipe-results-section").removeClass("d-none");
  $("#recipe-favourites-section").addClass("d-none");
  $("#display-user-ingredients").addClass("d-none");
  $("#nutritional-info").addClass("d-none");
  $("#display-user-choices").addClass("d-none")

  $("#ingredientsToSearch").empty();
  ingredientsSearch.length = 0;
});

// Event listener on nav link to show Nutritional Sections
$("#nutritionalNavigation").on("click", function () {
  $("#recipe-search-section").addClass("d-none");
  $("#recipe-results-section").addClass("d-none");
  $("#recipe-favourites-section").addClass("d-none");
  $("#nutritional-analysis-container").removeClass("d-none");
});

// Event listener on nav link to show Favourite Sections
$("#favouriteNavigation").on("click", function () {
  $("#recipe-favourites-section").removeClass("d-none");
  $("#recipe-search-section").addClass("d-none");
  $("#recipe-results-section").addClass("d-none");
  $("#nutritional-analysis-container").addClass("d-none");
  renderFavourites();
});
