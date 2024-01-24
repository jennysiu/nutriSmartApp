// Event listener on nav link to show Recipe Sections
$("#recipeNavigation").on("click", function () {
  $("#recipe-search-section").removeClass("d-none");
  $("#recipe-results-section").removeClass("d-none");
  $("#recipe-favourites-section").addClass("d-none");
  $("#nutritional-analysis-container").addClass("d-none");
  $("#display-user-ingredients").addClass("d-none");
  $("#nutritional-info").addClass("d-none");
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
  $("#recipe-search-section").addClass("d-none");
  $("#recipe-results-section").addClass("d-none");
  $("#recipe-favourites-section").removeClass("d-none");
  $("#nutritional-analysis-container").addClass("d-none");
});
