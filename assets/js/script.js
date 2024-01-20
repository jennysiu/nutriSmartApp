// Event listener for click id recipeNavigation and hide #nutritional-analysis
$("#recipeNavigation").on("click", function () {
  $(".recipe-search-section").removeClass("d-none");
  $(".randomRecipes").removeClass("d-none");
  $("#nutritional-analysis").addClass("d-none");
});

// Event listener for click id nutritionalNavigation and hide .recipe-search-section
$("#nutritionalNavigation").on("click", function () {
  $(".recipe-search-section").addClass("d-none");
  $(".randomRecipes").addClass("d-none");
  $("#nutritional-analysis").removeClass("d-none");
});

// Hide .nutritional-analysis-section on load
$(function () {
  $(".nutritional-analysis-section").addClass("d-none");
});

// todo: hide nutritional-info section & show when analyse is clicked
