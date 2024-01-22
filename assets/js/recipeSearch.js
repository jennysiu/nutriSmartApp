const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Array of favourite recipe URIs,  taken from localStorage
const favouriteRecipes = JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];
// Saves recipe URI, recipe title and recipe image, protein, total fat, net carbs and calories
/*[
    {
      "uri": "http://www.edamam.com/ontologies/edamam.owl#recipe_a2ff05c3bdd96dac307072dafe049ec1",
      "label": "Double Bacon Bagel Egg Casserole recipes",
      "image": "https://edamam-product-images.s3.amazonaws.com/web-img/298/298d7f6512722b92e4718f108d36cba0?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLWVhc3QtMSJHMEUCIQCI03kAhHN8C5POkpKhFClj6gww11ZayNtJim8KK1ourgIgfzfCktqGe%2FUCWmpLmWlD2QV5UeMEKtn5lklBiISSon0quQUIExAAGgwxODcwMTcxNTA5ODYiDN2KYIfbZM7vWHfs6iqWBaenyJt37ap7W8ecVRxe5D%2BQA3RX%2Fl%2BlZUSi6gR86MOMDZH7%2B9yl7hQNomh6Rufb3jDpjDgoqid7zxtVSa%2FM3cQWHSeOrvQw1IBaaSx4XICyXXYe5LBpAYRhtMCvYvRlVwdp87kDMDGCXoIPogWdRceevUV6j5UEOvt7YYG%2FrrT5a3vMqVDO4qFmvYoj%2F9hyp28ygaZ2gtv3H%2Fin8kKDEy3sovveS9Rh%2F8PgzBLle6ekwZlY4jk%2FI8pnR%2BO3T1HEKMLaQT5cj9aVo58PNVidERA7A65CdLtmPBN2XiMySMWZhQsmRaWQtoU1h3uKggNtNWe9mRsAgAVaq8ncNTGWW7jMmtEP0EB1Bo99N0S0ovaYkbvzZaTz8Z8Q%2FDIW7hc%2FlMY4Uidu1Vbr9P3BMEMio7QWUUTuMU22zl0UPia8bF4ujlstO5bkcVYy2Jj91D0zhgiiTXUjCOTCzYrgIFd8brib%2FPyZzJeNDhnA4WXzxwNRjh2wuUFs3gX0CqksTkT3bLee8JCsSyswPOMEt6c3IUGHURryANMsWCRNSRWPvS57dPMlJc%2B11NWVxtLPoZw1j%2BdjXeKhYIeAcmXp3uAJiOE05mXsKtw2oNVsHQ%2BzKwGQtfInQ2AttjyyYSd4AEgi0akWyXAaM%2FGaG93peNHzPmVX7iMtJrCfsFqY%2B9JOdX0V9Le5%2BOB53iNjj3RcNHNU7S43Y4ZqWDZrZU9yTNT436zU1IkgvWK%2B4KGBS5Uc%2FYIRlZBGNz%2FUjGmXHKbUU7XRHfnJSxN4B%2FWxxMMPbCLUtJkRQtYUcdTuE4W8SPBsG0Lxhv5z9MH5qmNzX574Jm5P1%2FC8w1j4smbX9SJSX7VO9qEp4xOnIaCe936JaXXVRZEODWkAL6sXMOG8rq0GOrEBL7PnjQ%2BBenTi9kQnDEB04n1kAmUBDZiu87vpUca5zAKyScDquZeRcMrBFV4EBEQX8dAXHwz8fOY9yTbSS7saevjb2CQM%2BThvNcNJdSLSe26vUAi8Q8uGS%2F2ElFA%2B4Jhos%2F5ixE4I3fEdvcTy5PSuKxT3o6PjWO6lm7WjfJqz3wZ3sxme7pxs1xEZ2JD6qkbqKUI5JvqeLrZNdV0m7wj1M5WctwKAuY49J6SNoLkO6YcQ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240120T110557Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFIEPDEKUV%2F20240120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=54a5dd8c1fec6ff068d3c0818eb1f8a371794786f400cf6e62e5287e8e928f2d"
      "protein": 0,
      "fat": 0,
      "carbs": 0,
      "calories:" 0
    }
]*/

// Array of ingredients to search
const ingredientsSearch = [];

// Array of recipe data on display so a favourite recipe can be moved into localStorage
let recipeResultData = [];

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

      // Empty global variable containing the array of recipe results on this page
      recipeResultData = 0;
      console.log(recipeResultData);

      // Empty the results
      $("#recipe-results").empty();

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

      // Save recipes to global variable for when the user adds a recipe to their favourites
      recipeResultData.push(...recipes);

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
                <button class="recipe-favourite" data-uri="${recipeUri}" data-index="${i}">
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
$("#recipe-results").on("click", ".recipe-favourite", function (e) {
  // Get the index of the recipe on the page
  const index = $(this).attr("data-index");

  // Is this a favourite
  const favorite = $(this).attr("data-fav");

  // If there is no info about fav or it is false then make it a favourite
  if (!favorite || favorite == "false") {
    // Add it to favourite recipes
    if (addFavouriteRecipe(recipeResultData[index])) {
      // set icon
      $(this).attr("data-fav", "true");
    }
  } else {
    // Remove from favourites and set icon class to "bi-heart" and data-fav="false"
    // removeFavouriteRecipe(uri);
  }
});

// Add recipe to favourites
function addFavouriteRecipe(recipe) {
  if (!recipe) {
    console.log("No recipe available to add to favourites!");
    return false;
  } else {
    // Check if it already exists
    // ... reorder?

    // Add to the end of the array (top?)
    favouriteRecipes.push(recipe);

    // Replace localstorage favourites with new (stringified) array of recipes
    localStorage.setItem("recipeSearch_favouriteRecipes", JSON.stringify(favouriteRecipes));

    console.log("added to favourites");
    return true;
  }
}

// Remove recipe from favourites
function removeFavouriteRecipe(uri) {
  // loop the array and look for uri
  // remove from array
  // Replace localstorage favourites with new array of recipes
}

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
