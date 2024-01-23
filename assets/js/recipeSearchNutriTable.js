const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Get favourite recipe data from localStorage or initialise as an empty array
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

  // Get and trim the value in the text box
  const inputText = $("#addRecipeIngredient input").val().trim();

  // If no input text then there's nothing to do so exit function
  if (!inputText) {
    return;
  }

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
  fetchRecipes().then((data) => {
    if (data.noResults) {
      // No data

      // Empty global variable containing the array of recipe results on this page
      recipeResultData = 0;

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
      console.log(data);
      // Work with the data

      // Array of returned recipes
      const recipes = data.hits;

      // Save recipes to global variable for when the user adds a recipe to their favourites
      recipeResultData.push(...recipes);

      // Empty the results
      $("#recipe-results").empty();
      // $(".diet-labels").empty();
      // $(".health-labels").empty();

      // Loop the recipes returned
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i].recipe;
        const recipeUri = recipe.uri;
        const recipeYield = recipe.yield;
        const recipeIngredients = recipe.ingredients;
        let totalTime = recipe.totalTime;
        let dailyPercentage = recipe.totalDaily;
        let totalNutrients = recipe.totalNutrients;

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

        // Set the fav icon and data-fav if this is a favourite recipe
        const recipeFavIcon = isFavouriteRecipe(recipeUri) ? "bi-heart-fill" : "bi-heart";
        const recipeDataFav = isFavouriteRecipe(recipeUri) ? "true" : "false";

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
                <button class="recipe-favourite" data-uri="${recipeUri}" data-index="${i}" data-fav="${recipeDataFav}">
                <i class="bi ${recipeFavIcon}"></i></button>
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

            <section class="row" id="nutritional-info">
              <!-- nutrition labels -->
              <section class="col-md-6" id="nutrition-labels">
                <!-- diet labels -->
                <section class="nutrition-row-section">
                  <h4 class="diet-label-header">Diet Labels</h4>
                  <section class="diet-labels">${renderDietLabels(recipe)}</section>
                </section>

                <!-- health labels -->
                <section class="nutrition-row-section">
                  <h4 class="health-label-header">Health Labels</h4>
                  <section class="health-labels">${renderHealthLabels(recipe)}</section>
                </section>
              </section>
      
              <!-- NUTRITION CARD -->
              <section class="col-md-6 nutrition-card" id="nutrition-card">
                <header class="nutrition-card__header">
                  <h3 class="nutrition-card__title">Nutrition Facts</h3>
                </header>
                <table class="nutrition-card__table">
                  <thead>
                    <tr>
                      <th colspan="3" class="small-info">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- calories -->
                    <tr>
                      <th colspan="3">
                        <b>Calories</b>
                        <span id="total-calories">${recipe.calories}</span>
                      </th>
                    </tr>
      
                    <!-- % daily value column label -->
                    <tr class="thick-row">
                      <td colspan="3" class="small-info">
                        <b>% Daily Value*</b>
                      </td>
                    </tr>
      
                    <!-- Macronutrients -->
                    <tr id="total-fats">
                      <!-- total fat -->
                      <th colspan="2">
                        <b>Total Fat</b>
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b>%</b>
                      </td>
                    </tr>
                    <!-- saturated fat -->
                    <tr id="saturated-fats">
                      <td class="blank-cell"></td>
                      <th>
                        Saturated Fat
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b>%</b>
                      </td>
                    </tr>
      
                    <!-- cholesterol -->
                    <tr id="cholesterol">
                      <th colspan="2">
                        <b>Cholesterol</b>
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b>%</b>
                      </td>
                    </tr>
      
                    <!-- sodium -->
                    <tr id="sodium">
                      <th colspan="2">
                        <b>Sodium</b>
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b></b>
                      </td>
                    </tr>
      
                    <!-- Carbs -->
                    <tr id="total-carbs">
                      <th colspan="2">
                        <b>Total Carbohydrate</b>
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b></b>
                      </td>
                    </tr>
      
                    <!-- fibre -->
                    <tr id="fibre">
                      <td class="blank-cell"></td>
                      <th>
                        Dietary Fiber
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b></b>
                      </td>
                    </tr>
      
                    <!-- sugar -->
                    <tr id="sugar">
                      <td class="blank-cell"></td>
                      <th>
                        Sugars
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b></b>
                      </td>
                    </tr>
      
                    <!-- protein -->
                    <tr class="thick-end" id="protein">
                      <th colspan="2">
                        <b>Protein</b>
                        <span class="quantity"></span>
                      </th>
                      <td class="percentage">
                        <b></b>
                      </td>
                    </tr>
                  </tbody>
                </table>
      
                <table class="performance-facts__table--grid vit-and-minerals-table">
                  <tbody id="vit-and-minerals-body">${renderVitAndMins(recipe)}</tbody>
                </table>

              </section>
            </section>            


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

function renderDietLabels(recipe) {
  const dietLabels = recipe.dietLabels;
  // console.log(dietLabels);

  // Create an element for the labels
  const el = $("<div>").addClass("diet-labels");

  // Loop and add each diet label to the element
  for (let i = 0; i < dietLabels.length; i++) {
    const dietBadge = $("<span>").addClass("badge label-badge").text(dietLabels[i]);
    $(el).append(dietBadge);
  }
  return el.html();
}

function renderHealthLabels(recipe) {
  // health labels to remove from list API list
  let unwantedHealthLabels = [
    "SULPHITE_FREE",
    "SESAME_FREE",
    "SUGAR_CONSCIOUS",
    "SPECIFIC_CARBS",
    "MILK_FREE",
    "FISH_FREE",
    "WHEAT_FREE",
    "MEDITERRANEAN",
    "DASH",
    "EGG_FREE",
    "RED_MEAT_FREE",
    "CELERY_FREE",
    "MUSTARD_FREE",
    "LUPINE_FREE",
    "ALCOHOL_FREE",
    "NO_OIL_ADDED",
    "NO_SUGAR_ADDED",
    "FODMAP_FREE",
  ];

  let healthLabels = recipe.healthLabels;
  // new array with unwanted health labels filtered out
  let healthLabelsToKeep = healthLabels.filter((item) => !unwantedHealthLabels.includes(item));
  //console.log(healthLabelsToKeep);

  // Create an element for the labels
  const el = $("<div>").addClass("health-labels");

  // Add health labels
  for (let i = 0; i < healthLabelsToKeep.length; i++) {
    const healthBadge = $("<span>").addClass("badge label-badge").text(healthLabelsToKeep[i]);
    $(el).append(healthBadge);
  }

  // Return rendered html
  return el.html();
}

function renderVitAndMins(recipe) {
  let totalDailyPercentage = recipe.totalDaily;
  console.log(totalDailyPercentage);
  let firstColumnEmpty = true;
  let tableRow = null;

  const allVitAndMinerals = [
    "CA",
    "FE",
    "K",
    "MG",
    "NIA",
    "P",
    "RIBF",
    "THIA",
    "TOCPHA",
    "VITA_RAE",
    "VITB6A",
    "VITB12",
    "VITC",
    "VITD",
    "VITK1",
    "ZN",
  ];

  // Create an element to hold the table
  const el = $("<div>").addClass("vit-and-minerals-body"); // This must be a class as there are many on the page at the same time

  for (const key in totalDailyPercentage) {
    if (totalDailyPercentage.hasOwnProperty(key)) {
      let vitAndMineralsName = totalDailyPercentage[key].label;
      let vitAndMineralsQuantity = totalDailyPercentage[key].quantity.toFixed(1);
      // console.log(vitAndMineralsName);
      // console.log(key);

      // filter out zero quantities && if the key is a nutrient in the allVitAndMinerals array
      // (to avoid duplicate nutrients already added in nutri card)
      // dynamically render vitamins onto nutrition card
      if (vitAndMineralsQuantity > 0 && allVitAndMinerals.includes(key)) {
        if (firstColumnEmpty) {
          tableRow = $("<tr>").addClass("vitamin-row");

          let tableDataOne = $("<td>").text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

          tableRow.append(tableDataOne);

          firstColumnEmpty = false;
        } else {
          let tableDataTwo = $("<td>").text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

          tableRow.append(tableDataTwo);

          let thinLine = $("<tr>").addClass("thin-end");

          $(el).append(tableRow);
          $(el).append(thinLine);

          firstColumnEmpty = true;
        }
      }
    }
  }

  // Create table
  const table = $("<table>").addClass("vit-and-minerals-table");

  // Create tbody
  const tbody = $("<tbody>").addClass("vit-and-minerals-body"); // ? Class maybe not needed as we can style the table via .vit-and-minerals-table

  // Add tbody
  $(table).append(tbody);

  // Add table rows
  $(table).append(el);

  // Return rendered html
  return el.html();
}

// Lookup if recipe is a favourite in global array and return true or false
function isFavouriteRecipe(uri) {
  // Loop array and try to find uri
  for (let i = 0; i < favouriteRecipes.length; i++) {
    const recipe = favouriteRecipes[i].recipe;

    // Check if there is a match and exit function if found
    if (recipe.uri === uri) {
      return true;
    }
  }
}

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

// Add recipe to favourites
function addFavouriteRecipe(recipe) {
  if (!recipe) {
    return false;
  } else {
    // Prevent duplicates by looping the favourites
    for (let i = 0; i < favouriteRecipes.length; i++) {
      const uri = favouriteRecipes[i].recipe.uri;

      // Check if this uri exists in the array
      if (recipe.uri === uri) {
        // Prevent adding more than one by exiting the function
        return true;
      }
    }

    // Add to the end of the array
    favouriteRecipes.push(recipe);

    // Replace localstorage favourites with new (stringified) array of recipes
    localStorage.setItem("recipeSearch_favouriteRecipes", JSON.stringify(favouriteRecipes));

    return true;
  }
}

// Remove recipe from favourites
function removeFavouriteRecipe(uri) {
  // loop the favouriteRecipes array and look for uri
  //   if a match is found;
  //    remove from favouriteRecipes array
  //    replace localstorage favourites with new array of recipes
}

// Event listener on recipe favourite button to add to favourites array ("favouriteRecipes") and localStorage ("recipeSearch_favouriteRecipes")
$("#recipe-results").on("click", ".recipe-favourite", function (e) {
  // Get the index of the recipe on the page
  const index = $(this).attr("data-index");

  // Is this a favourite
  const favorite = $(this).attr("data-fav");

  // If there is no info about fav or it is false then make it a favourite
  if (!favorite || favorite === "false") {
    // Add it to favourite recipes
    if (addFavouriteRecipe(recipeResultData[index])) {
      // set icon
      $(this).find(".bi-heart").removeClass("bi-heart").addClass("bi-heart-fill");

      //Set data attribute
      $(this).attr("data-fav", "true");
    }
  } else {
    // Remove from favourites via data-uri
    // Conditionaly call removeFavouriteRecipe(uri) as above but set data-fav to "false" and switch the icon classes
  }
});

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