const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Array of favourite recipe IDs taken from localStorage
const favouriteRecipies = JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];

// Array of ingredients to search
const ingredientsSearch = [];

// Function to fetch given recipes using search

// Function to display a single recipe

// Event listener on ingredient button to remove it from the array
$("#addIngredient").on("click", ".remove-ingredient", function (e) {
  e.preventDefault();
  // Which button did we click
  console.log(this);
});

// Event listener on ingredient search form
$("#addIngredient").on("submit", function (e) {
  e.preventDefault();
  console.log("Add Ingredients");

  const inputText = $("#addIngredient input").val().trim();

  // Convert any non word or special characters other than hyphen, with "+"
  const ingredient = inputText.replace(/[^\w\s-]+/g, "+");

  // Array of searched items
  const ingredients = ingredient.split("+");

  console.log(ingredients);

  for (i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];

    // Add ingredient to global array of ingredients to search
    ingredientsSearch.push(ingredient);
  }

  $("#addIngredient input").val("");

  // Show recipe ingredients
  renderRecipeSearchIngredients();
});

// Render the buttons for searching with
function renderRecipeSearchIngredients() {
  // Clear the ingredients search buttons
  $("#ingredientsToSearch").empty();

  // Add buttons for each in the global array to search
  for (i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    const button = $(`<div class="d-inline">
                        <button class="remove-ingredient btn btn-sm btn-secondary">${ingredient} <i class="bi bi-dash"></i></button>
                      </div>`);

    // Add button
    $("#ingredientsToSearch").append(button);
  }
}

// Event listener on the recipe search button
$("#searchRecipes").on("click", function () {
  console.log("Recipe Search");

  fetchRecipes().then((data) => {
    // Array of returned recipes
    const recipes = data.hits;

    // Loop the recipes returned
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i].recipe;
      const recipeUri = recipe.uri;
      //      const recipeImageWidth = recipe.images.REGULAR.width;
      const recipeYield = recipe.yield;
      const recipeIngredients = recipe.ingredients;

      // List the ingredients
      const recipeIngredientsList = $("<ul>");
      for (let j = 0; j < recipeIngredients.length; j++) {
        const recipeIngredient = $(`<li>${recipeIngredients[j].food}</li>`);
        console.log(`Recipe Ingredient: ${recipeIngredients[j].food}`);
        recipeIngredientsList.append(recipeIngredient);
      }

      const recipeResult = $(`

        <div class="recipeResult py-3" style="cursor:pointer" data-uri="${recipeUri}">
          <div class="row">
            <div class="col-sm-3">
              <img src="${recipe.images.REGULAR.url}" style="width:100%;height:auto">
            </div>
            <div class="col-sm-9">
              <h4>${recipe.label}</h4>
              <div>Ingredients: ${recipeIngredientsList.prop("outerHTML")}</div>
              <a href="#" class="btn btn-secondary btn-sm">Servings ${recipeYield}</a>
            </div>
          </div>
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
    // Get search terms from array of search terms

    // Get incredients from text box - this will be changed to pull ingredients from the array
    const inputText = $("#addIngredient input").val().trim();
    const tags = inputText.replace(/ |,/g, "+");

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
