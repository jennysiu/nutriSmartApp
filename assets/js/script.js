// Target Nav Buttons
// recipeNavigation
// nutritionalNavigation

// Event listener for click id recipeNavigation and hide .nutritional-analysis-section
$("#recipeNavigation").on("click", function () {
  $(".recipe-search-section").removeClass("d-none");
  $(".nutritional-analysis-section").addClass("d-none");
});

// Event listener for click id nutritionalNavigation and hide .recipe-search-section
$("#nutritionalNavigation").on("click", function () {
  $(".recipe-search-section").addClass("d-none");
  $(".nutritional-analysis-section").removeClass("d-none");
});

// Hide .nutritional-analysis-section on load
$(function () {
  $(".nutritional-analysis-section").addClass("d-none");
});
