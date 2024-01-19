const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Array of common ingredients for populating the buttons
const commonIngredients = [
  "chicken",
  "pork",
  "beef",
  "turkey",
  "fish",
  "carrot",
  "apple",
  "potato",
];

// Array of favourite recipe IDs taken from localStorage
const favouriteRecipies =
  JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];

// Populate the common ingredients button from the array of ingredients
function renderCommonIngredients() {
  for (i = 0; i < commonIngredients.length; i++) {
    console.log(i);
  }
}

// Function to fetch given recipes using search

// Function to display a single recipe

// Event listener on ingredient form
$("#addIngredient").on("submit", function (e) {
  e.preventDefault();
  console.log("Add Ingredients");
});

// Event listener on the recipe search button
$("#searchRecipes").on("click", function () {
  console.log("Recipe Search");

  fetchRecipes().then((data) => {
    console.log(data);

    // Array of returned recipes
    const recipes = data.hits;

    for (i = 0; i < recipes.length; i++) {
      const recipeHeading = $("<p>").text(recipes[i].recipe.label);
      $("#recipe-results").append(recipeHeading);
    }
  });
});

// Event listener on recipe favourite button to add to favourites and localStorage

// API search
async function fetchRecipes() {
  try {
    // Get search terms from list use "data-ingredient"

    const tags = "egg+bacon";

    // Construct search URL
    const recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&tag=${tags}`;

    // await response call
    console.log("Requesting:", recipeSearchURL);
    let response = await fetch(recipeSearchURL);
    console.log("Response Status:", response.status);

    // once response retrieved, convert to json format
    let data = await response.json();

    // return data
    return data;
  } catch (error) {
    // console error message
    console.error("Fetch error:", error);
  }
}
