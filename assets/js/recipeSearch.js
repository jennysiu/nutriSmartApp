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
    // Array of returned recipes
    const recipes = data.hits;

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i].recipe;
      const recipeUri = recipe.uri;
      const recipeImageWidth = recipe.images.REGULAR.width;
      const recipeYield = recipe.yield;

      console.log(recipe.ingredients);
      console.log(recipe.ingredients[0]);
      console.log(recipe.ingredients[0].food);

      // Get ingredients list
      const recipeIngredientsList = $("<ul>");
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const recipeIngredient = $(`<li>${recipe.ingredients[j].food}</li>`);
        console.log(`Recipe Ingredient: ${recipe.ingredients[j].food}`);
        recipeIngredientsList.text(recipeIngredient);
      }

      const recipeResult = $(`

        <div class="recipeResult" style="cursor:pointer" data-uri="${recipeUri}">
          <img src="${recipe.images.REGULAR.url}" style="width:${recipeImageWidth}px;height:auto">
          <h4>${recipe.label}</h4>
          <div>Ingredients: ${recipeIngredientsList}</div>
          <a href="#" class="btn btn-secondary btn-sm">Serves ${recipeYield}</a>
        </div>

      `);

      $("#recipe-results").append(recipeResult);
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
    //console.log("Requesting:", recipeSearchURL);
    let response = await fetch(recipeSearchURL);
    //console.log("Response Status:", response.status);

    // once response retrieved, convert to json format
    let data = await response.json();

    // Convert the JSON data to a string
    const jsonString = JSON.stringify(data);

    // Check the length of the string in bytes
    const byteSize = new Blob([jsonString]).size;

    //console.log(`JSON Data Size: ${byteSize} bytes`);

    // return data
    return data;
  } catch (error) {
    // console error message
    console.error("Fetch error:", error);
  }
}

// fetchRecipes()

// Using the async function
// fetchRecipes().then(data => {
// console.log(data);
// assign data variables here (ouotputs we need)
// filter data to data variables
// });
