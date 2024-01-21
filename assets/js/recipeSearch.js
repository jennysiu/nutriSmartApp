const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Array of favourite recipe IDs taken from localStorage
const favouriteRecipes = JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];

// Array of ingredients to search
const ingredientsSearch = [];

// Array of recipe data on display so a favourite recipe can be moved into localStorage
const recipeResultData = [];

// Event listener on ingredient button to remove it from the array
$("#ingredientsToSearch").on("click", ".search-recipe-ingredient", function (e) {
  // Remove clicked ingredient from array of ingredients
  for (let i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    if (ingredient === $(e.target).attr("data-ingredient")) {
      // remove this ingredient from search array
      ingredientsSearch.splice(i, 1);
    }
  }
  // rerender the buttons
  renderRecipeSearchIngredients();
});

// Event listener on ingredient search form
$("#addRecipeIngredient").on("submit", function (e) {
  e.preventDefault();

  const inputText = $("#addRecipeIngredient input").val().trim();

  // Convert all non word or special characters other than hyphen, with "+"
  const ingredient = inputText.replace(/[^\w\s-]+/g, "").replace(/\s+/g, "+");

  // Array of searched items
  const ingredients = ingredient.split("+");

  for (i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];

    // Add ingredient to global array of ingredients to search
    ingredientsSearch.push(ingredient);
  }

  // Clear the input box
  $("#addRecipeIngredient input").val("");

  // Show recipe ingredients
  renderRecipeSearchIngredients();
});

// Render the buttons for searching with
function renderRecipeSearchIngredients() {
  // Clear the ingredients search buttons
  $("#ingredientsToSearch").empty();
  $("#searchRecipes").addClass("d-none");

  // Add buttons for each in the global array to search
  for (i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    const button = $(`<div class="d-inline">
                        <button class="search-recipe-ingredient btn btn-sm btn-secondary" data-ingredient="${ingredient}">${ingredient} <i class="bi bi-dash"></i></button>
                      </div>`);

    // Add button
    $("#ingredientsToSearch").append(button);
  }

  // Show the search button if there are ingredients to search with
  if (i > 0) {
    $("#searchRecipes").removeClass("d-none");
  }
}

// Event listener on the recipe search button
$("#searchRecipes").on("click", function () {
  console.log("Recipe Search");

  fetchRecipes().then((data) => {
    if (data.noResults) {
      // No data
      console.log("No recipes found");

      // No recipes found, so briefly show a message
      const elNoResults = $("<span>")
        .addClass("invalid-feedback")
        .addClass("px-3")
        .text("No recipes found! Please try again.")
        .insertAfter($("#searchRecipes"))
        .show();

      setTimeout(function () {
        elNoResults.hide();
      }, 3000);
    } else if (data.error) {
      // Handle any errors
      console.error("Error:", data.error);
    } else {
      // Work with the data

      // Array of returned recipes
      const recipes = data.hits;

      // Empty the results
      $("#recipe-results").empty();

      // Loop the recipes returned
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i].recipe;
        const recipeUri = recipe.uri;
        const recipeYield = recipe.yield;
        const recipeIngredients = recipe.ingredients;
        let totalTime = recipe.totalTime;

        // If a prep time isn't useful show question mark
        if (!totalTime || isNaN(parseFloat(totalTime)) || !isFinite(totalTime) || totalTime === 0) {
          totalTime = "?";
        }

        // List the ingredients
        const recipeIngredientsList = $("<ul>").addClass("recipe-ingredients-list");
        for (let j = 0; j < recipeIngredients.length; j++) {
          const recipeIngredient = $(`<li>${recipeIngredients[j].food}</li>`);
          recipeIngredientsList.append(recipeIngredient);
        }

        // Build list with images of ingredients
        const recipeIngredientsDetail = $("<ul>").addClass(
          "recipe-ingredients-detail list-unstyled"
        );
        const recipeIngredientsArray = recipe.ingredients;
        for (let i = 0; i < recipeIngredientsArray.length; i++) {
          const title = $("<h5>").text(recipeIngredientsArray[i].text).addClass("p-3");
          const image = $("<img>")
            .attr("src", recipeIngredientsArray[i].image)
            .attr("loading", "lazy")
            .addClass("rounded")
            .attr("style", "max-width:50px;height:auto");
          const div = $("<div>").addClass("d-flex align-items-center").append(image, title);

          const li = $("<li>").append(div);

          recipeIngredientsDetail.append(li);
        }

        const recipeResult = $(`

        <div class="recipe-result py-3" style="cursor:pointer" data-uri="${recipeUri}">
          <div class="row">

            <div class="col-sm-3">
              <img class="rounded" src="${
                recipe.images.REGULAR.url
              }" style="width:100%;height:auto" loading="lazy">
              <div class="recipe-meta d-flex justify-content-between">
                <span class="recipe-servings">Servings ${recipeYield}</span>
                <span class="recipe-time"><i class="bi bi-clock"></i> ${totalTime}</span>
              </div>
            </div>

            <div class="col-sm-9 d-flex flex-column">
              <div class="d-flex justify-content-between">
                <h3>${recipe.label}</h3>
                <button class="recipe-favourite" data-uri="${recipeUri}">
                <i class="bi bi-heart-fill"></i></button>
              </div>
              <div class="recipe-ingredients">Ingredients: 
                ${recipeIngredientsList.prop("outerHTML")}
              </div>
              <div class="mt-auto recipe-button-container pb-3">
                <button class="recipe-nutrition-button btn btn-primary btn-md">Nutrition 
                  <i class="bi bi-chevron-down"></i></button>
                <button data-url="${
                  recipe.url
                }" class="recipe-method-button btn btn-secondary btn-md">Method 
                  <i class="bi bi-box-arrow-up-right"></i></button>                        
              </div>
          </div>

        </div> 
        
        <!-- Hidden view -->
        <div class="recipe-detail-row row d-none">
          <div class="col-sm-6">

            <h3>Ingredients</h3>
            ${recipeIngredientsDetail.prop("outerHTML")}
            <button data-url="${recipe.url}" 
                    class="recipe-method-button btn btn-secondary btn-md">Method <i class="bi bi-box-arrow-up-right"></i></button>
            <span class="recipe-attribution">by ${recipe.source}</span>

          </div>
          <div class="col-sm-6">

            <h3>Nutrition</h3>
            <table>TABLE</table>

          </div>
        </div>        
        
      </div>
      <hr style="border: 1px solid #999;">
      `);

        $("#recipe-results").append(recipeResult);
      }
    }
  });
});

// Event listener on nutrition button to open/close full nutrition info
$("#recipe-results").on("click", ".recipe-nutrition-button", function (e) {
  const button = e.target;

  // Show recipe detail row
  $(button).closest(".recipe-result").find(".recipe-detail-row").removeClass("d-none");
});

// Event listener on recipe method buttons to open source recipe website in a named window
$("#recipe-results").on("click", ".recipe-method-button", function (e) {
  const button = e.target;

  const url = $(button).attr("data-url");

  const winName = "recipeWindow";

  window.open(url, winName);
});

// Event listener on recipe favourite button to add to favourites array ("favouriteRecipes") and localStorage ("recipeSearch_favouriteRecipes")
//   If recipe is to be favourite (data-fav="false")
//     Lookup clicked recipe in recipeResultData array
//       Add entire recipe object to favouriteRecipes array
//       Add entire recipe object to localStorage
//       Set icon to "bi-heart-fill"
//       Set data-fav="true"
//   If recipe is not to be a favourite (data-fav="true")
//     Remove entire recipe object from favouriteRecipes array
//     Remove entire recipe object from localStorage
//     Set icon class to "bi-heart"
//     Set data-fav="false"

// API search
async function fetchRecipes() {
  try {
    // Get search terms from array of search terms
    const tags = ingredientsSearch.join("+");

    // Construct search URL
    const recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&tag=${tags}`;

    // await response call
    let response = await fetch(recipeSearchURL);

    // once response retrieved, convert to json format
    let data = await response.json();

    // Check for zero results and return and set data.noResults to true
    // This is so that the calling function can check any were found
    if (data.count === 0) {
      return { noResults: true };
    }

    // return data
    return data;
  } catch (error) {
    // console error message
    console.error("Fetch error:", error);
  }
}
