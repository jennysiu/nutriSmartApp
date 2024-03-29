// Jennys
const RECIPE_SEARCH_API_ID = "f2f4ac30";
const RECIPE_SEARCH_API_KEY = "718e862b4ce3b44d9cf1b8a149daf83c";

// Get favourite recipe data from localStorage or initialise as an empty array
const favouriteRecipes = JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];

const dietaryReqArray = ["pescatarian", "vegan", "vegetarian", "kosher"];

const allergiesArray = [
  "Gluten-free",
  "Wheat-free",
  "Egg-Free",
  "Peanut-Free",
  "Tree-Nut-Free",
  "Soy-Free",
  "Shellfish-Free",
  "Crustacean-Free",
  "Celery-Free",
  "Sesame-Free",
  "Lupine-Free",
  "Mollusk-Free",
  "Mustard-Free",
];

const cuisinesArray = [
  "American",
  "Asian",
  "British",
  "Caribbean",
  "Central Europe",
  "Chinese",
  "Eastern Europe",
  "French",
  "Indian",
  "Italian",
  "Japanese",
  "Kosher",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "South American",
  "South East Asian",
];

// Array of ingredients to search
const ingredientsSearch = [];

// Array of recipe data on display so a favourite recipe can be moved into localStorage
const recipeResultData = [];

// Event listener on ingredient button to remove it from the array
$("#ingredientsToSearch").on("click", ".search-recipe-ingredient", function (e) {
  // Remove clicked ingredient from array of ingredients
  for (let i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    if (ingredient === $(this).attr("data-ingredient")) {
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

// dynamically render allergy options
// loop through allergiesArray and dynamically render allergy checkboxes
for (let i = 0; i < allergiesArray.length; i++) {
  let allergy = allergiesArray[i];
  // console.log(allergy)

  let allergyItemContainerEl = $("<span>").addClass("choiceContainer");

  let allergyLabel = $("<label>").attr("for", `alergy-${allergy}`).text(allergy);

  let allergyCheckboxEl = $("<input>").attr({
    type: "checkbox",
    name: `allergy`,
    id: `${allergy}`,
    value: `${allergy.toLowerCase()}`,
  });

  $("#allergies-options").append(allergyItemContainerEl);
  // allergyItemContainerEl.append(allergyLabel, allergyCheckboxEl)
  allergyItemContainerEl.append(allergyCheckboxEl, allergyLabel);
}

// dynamically render cuisine types
// loop through allergiesArray and dynamically render cuisine checkboxes
for (let i = 0; i < cuisinesArray.length; i++) {
  let cuisine = cuisinesArray[i];
  // console.log(cuisine)

  let cuisineItemContainerEl = $("<span>").addClass("choiceContainer");

  let cuisineCheckboxEl = $("<input>").attr({
    type: "checkbox",
    name: `cuisine`,
    id: `${cuisine}`,
    value: `${cuisine.toLowerCase()}`,
  });

  let cuisineLabel = $("<label>").attr("for", `cuisine-${cuisine}`).text(cuisine);

  $("#cuisine-options").append(cuisineItemContainerEl);
  cuisineItemContainerEl.append(cuisineCheckboxEl, cuisineLabel);
}

// Event listener on the recipe search button
$("#searchRecipes").on("click", function () {
  // clear existing data
  $("#display-user-choices").empty();

  let meal = [];
  let diet = [];
  // retreive user dietary requirmenets and filtering
  // Get search terms from array of search terms
  // need to convert tags intio an array
  let tags = ingredientsSearch.join("+");

  // converts into an array of query tags
  let tagsArray = tags.split("+");
  let qTags;
  for (let i = 0; i < tagsArray.length; i++) {
    qTags = qTags + "&tag=" + tagsArray[i];
  }

  let mealChoice = $("input[name='meal-type']:checked").attr("id");

  if (mealChoice) {
    meal = [mealChoice.toLowerCase()];
  }

  let dietChoice = $("input[name='dietary-req']:checked").attr("id");

  if (dietChoice) {
    diet = [dietChoice.toLowerCase()];
    // Now 'dietChoice' is an array with the ID of the checked radio button in lowercase
  }

  let allergieChoices = $("input[name='allergy']:checked")
    .map(function () {
      return $(this).attr("id");
    })
    .get();

  let cuisineChoices = $("input[name='cuisine']:checked")
    .map(function () {
      return $(this).attr("id");
    })
    .get();

  // console.log(mealChoice);
  // console.log(diet);

  // console.log(meal);
  // console.log(diet);
  // console.log(cuisineChoices);
  // console.log(allergieChoices);

  // dynamically display/repeat back what user has selcted here
  $("#display-user-choices").removeClass("d-none");

  let usersDiet = dietaryReqArray.filter((element) => diet.includes(element));
  let usersAllergies = allergiesArray.filter((element) => allergieChoices.includes(element));

  // create new array to display in lower case later
  let usersAllergiesInLower = [];

  for (let i = 0; i < usersAllergies.length; i++) {
    allergy = usersAllergies[i].toLowerCase();
    usersAllergiesInLower.push(allergy);
  }

  // console.log(usersDiet);
  // console.log(usersAllergies);

  let displayUserChoicesHeader = $("<h5>")
    .addClass("displayUserSearchInfo")
    .text("Searching recipes for:");
  $("#display-user-choices").append(displayUserChoicesHeader);

  // adds space between array items for the ingredients
  for (let i = 1; i < tagsArray.length; i++) {
    displayTags = tagsArray[0] + " " + tagsArray[i];
  }

  $("#display-user-choices").append(
    $("<p>").addClass("displayUserSearchInfo").text(`Ingredients: ${tagsArray}`)
  );

  if (mealChoice) {
    $("#display-user-choices").append(
      $("<p>").addClass("displayUserSearchInfo").text(`Meal type: ${meal}`)
    );
  }
  if (usersDiet.length > 0) {
    $("#display-user-choices").append(
      $("<p>").addClass("displayUserSearchInfo").text(`Dietary requirements: ${usersDiet}`)
    );
  }
  if (usersAllergies.length > 0) {
    $("#display-user-choices").append(
      $("<p>").addClass("displayUserSearchInfo").text(`Allergies: ${usersAllergiesInLower}`)
    );
  }

  if (cuisineChoices > 0) {
    $("#display-user-choices").append(
      $("<p>").addClass("displayUserSearchInfo").text(`Cuisine: ${cuisineChoices}`)
    );
  }

  // API PARAMETERS
  // Get random results
  let random = "true";

  // Construct search URL
  let recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&random=${random}&tag=${qTags}`;

  // builds on URL based on user preferences entered
  if (meal.length > 0) {
    recipeSearchURL += `&mealType=${meal}`;
  }

  // console.log(usersDiet);

  if (usersDiet.length > 0) {
    recipeSearchURL += `&health=${usersDiet}`;
  }

  if (cuisineChoices.length > 0) {
    for (let i = 0; i < cuisineChoices.length; i++) {
      recipeSearchURL += `&cuisineType=${cuisineChoices[i].toLowerCase()}`;
    }
  }
  if (allergieChoices.length > 0) {
    for (let i = 0; i < allergieChoices.length; i++) {
      recipeSearchURL += `&health=${allergieChoices[i].toLowerCase()}`;
    }
  }

  // console.log(recipeSearchURL);
  fetchRecipes(recipeSearchURL).then((data) => {
    if (data.noResults) {
      // No data

      // Empty global variable containing the array of recipe results on this page
      recipeResultData.length = 0;

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
      renderRecipes(data);
    }
  });
});

// Event listener for delete favourites button
$("#deleteAllFavourites").on("click", function () {
  // Flush favourites array
  favouriteRecipes.length = 0;

  // Replace localStorage favourites with new (stringified) array of recipes
  localStorage.setItem("recipeSearch_favouriteRecipes", JSON.stringify(favouriteRecipes));

  // Empty the results
  $("#recipe-results").empty();

  // Render the edit favourites modal so it is emptied too
  renderFavouritesModal();
});

// Event listener for the favourites modal to update its contents before being displayed
$("#favouriteRecipesEditModal").on("show.bs.modal", function (event) {
  renderFavouritesModal();
});

// Render the favourites modal from the favourites array
function renderFavouritesModal() {
  // Clear all favourites
  $("#favouriteRecipesModalContainer").empty();

  // console.log(favouriteRecipes);

  // Loop the favourites in global array and render rows for each recipe
  for (let i = 0; i < favouriteRecipes.length; i++) {
    const row = $("<div>").addClass("row");
    const recipe = favouriteRecipes[i].recipe;
    const col1 = $("<div>").addClass("col-10 fs-3 lh-base");
    const col2 = $("<div>").addClass("col-2 text-center fs-3 lh-base");
    const button = $("<button>")
      .addClass("recipe-favourite")
      .attr("data-uri", recipe.uri)
      .attr("data-index", i);
    const icon = $("<i>").addClass("bi bi-heart-fill");
    const title = $("<h5>").text(recipe.label);

    // Add icon to button
    button.append(icon);

    // Add title and button to columns
    col1.append(title); // Make link to view single recipe
    col2.append(button);

    // save both columns to the row
    row.append(col1, col2);

    // Save the row to the recipe container
    $("#favouriteRecipesModalContainer").append(row);
  }
}

// Fetch and render favourites
function renderFavourites() {
  // variable to build the uri querystring parameter
  let uris = "";

  // Get uri from favourites array and construct uri query parameters
  for (let i = 0; i < favouriteRecipes.length; i++) {
    const uri = favouriteRecipes[i].recipe.uri;

    // Add ampersand separator but not on the first uri
    if (i > 0) {
      uris = uris + "&uri=" + encodeURIComponent(uri);
    } else {
      uris = uris + "uri=" + encodeURIComponent(uri);
    }
  }

  // Exit if there are no favourites
  if (!uris) {
    // Empty the results
    $("#recipe-results").empty();

    // Render the favourite recipes modal to prevent a single recipe being left over once the favourite array is empty
    renderFavouritesModal();
    return false;
  }

  // Construct search URL
  const recipeSearchURL = `https://api.edamam.com/api/recipes/v2/by-uri?${uris}&type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}`;

  fetchRecipes(recipeSearchURL).then((data) => {
    if (data.noResults) {
      // No data

      // Empty global variable containing the array of recipe results on this page
      recipeResultData.length = 0;

      // Empty the results
      $("#recipe-results").empty();

      // No recipes found, so briefly show a message
      const elNoResults = $("<span>")
        .addClass("invalid-feedback")
        .addClass("px-3")
        .text("No favourites found.")
        .insertAfter($("#recipe-favourites-section"))
        .show();

      setTimeout(function () {
        elNoResults.hide();
      }, 3000);
    } else if (data.error) {
      // Handle any errors
      console.error("Error:", data.error);
    } else {
      //Render recipes in results and the edit favourites modal list
      renderRecipes(data);
      renderFavouritesModal();
    }
  });
}

// Render recipes in results section
function renderRecipes(data) {
  // Flush the recipe results array before adding to it again (so they don't accumulate)
  recipeResultData.length = 0;

  // Check there is data to work with
  if (!data) {
    console.error("Error: No recipe data to render");
    return false;
  }

  // console.log(data);

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
    const recipeIngredientsDetail = $("<ul>").addClass("recipe-ingredients-detail list-unstyled");
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

        <div class="recipe-result py-3" data-uri="${recipeUri}">
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
              <div class="d-flex justify-content-start">
                <h3>${recipe.label}</h3>
                ${renderDietLabels(recipe)}
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
            
            <!-- NUTRITION CARD -->
            <section class="col-sm-12 col-md-12 nutrition-card">
              <header class="nutrition-card__header">
                <h4 class="nutrition-card__title">Nutrition Facts</h4>
              </header>
              <table class="nutrition-card__table">
                <thead>
                  <tr>
                    <th colspan="3" class="small-info">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- calories -->
                  <tr id="calories-container">
                    <th colspan="3">
                      <b>Calories</b>
                      <span class="total-calories">${recipe.calories.toFixed(0)}</span>
                    </th>
                  </tr>
    
                  <!-- % daily value column label -->
                  <tr class="thick-row">
                    <td colspan="3" class="small-info">
                      <b>% Daily Value*</b>
                    </td>
                  </tr>
    
                  <!-- Macronutrients -->
                  <tr class="total-fats">
                    <!-- total fat -->
                    <th colspan="2">
                      <b>Total Fat</b>
                      <span class="quantity">${
                        totalNutrients.FAT.quantity.toFixed(1) + totalNutrients.FAT.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.FAT.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
                  <!-- saturated fat -->
                  <tr class="saturated-fats">
                    <td class="blank-cell"></td>
                    <th>
                      Saturated Fat
                      <span class="quantity">${
                        totalNutrients.FASAT.quantity.toFixed(1) + totalNutrients.FASAT.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.FASAT.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
    
                  <!-- cholesterol -->
                  <tr class="cholesterol">
                    <th colspan="2">
                      <b>Cholesterol</b>
                      <span class="quantity">${
                        totalNutrients.CHOLE.quantity.toFixed(1) + totalNutrients.CHOLE.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.CHOLE.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
    
                  <!-- sodium -->
                  <tr class="sodium">
                    <th colspan="2">
                      <b>Sodium</b>
                      <span class="quantity">${
                        totalNutrients.NA.quantity.toFixed(1) + totalNutrients.NA.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.NA.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
    
                  <!-- Carbs -->
                  <tr class="total-carbs">
                    <th colspan="2">
                      <b>Total Carbohydrate</b>
                      <span class="quantity">${
                        totalNutrients.CHOCDF.quantity.toFixed(1) + totalNutrients.CHOCDF.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.CHOCDF.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
    
                  <!-- fibre -->
                  <tr class="fibre">
                    <td class="blank-cell"></td>
                    <th>
                      Dietary Fibre
                      <span class="quantity">${
                        totalNutrients.FIBTG.quantity.toFixed(1) + totalNutrients.FIBTG.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.FIBTG.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
    
                  <!-- sugar -->
                  <tr class="sugar">
                    <td class="blank-cell"></td>
                    <th>
                      Sugars
                      <span class="quantity">${
                        totalNutrients.SUGAR.quantity.toFixed(1) + totalNutrients.SUGAR.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b></b>
                    </td>
                  </tr>
    
                  <!-- protein -->
                  <tr class="thick-end" class="protein">
                    <th colspan="2">
                      <b>Protein</b>
                      <span class="quantity">${
                        totalNutrients.PROCNT.quantity.toFixed(1) + totalNutrients.PROCNT.unit
                      }</span>
                    </th>
                    <td class="percentage">
                      <b>${dailyPercentage.PROCNT.quantity.toFixed(1)}%</b>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              ${renderVitAndMins(recipe)}

            </section>
          </section>            


          </div>
        </div>        
        
      </div>
      <hr style="border: 1px solid #999;">
      `);

    $("#recipe-results").append(recipeResult);
  }
  $("#recipe-results-section").removeClass("d-none");
}

function renderDietLabels(recipe) {
  const dietLabels = recipe.dietLabels;

  // Create an element for the labels
  const el = $("<div>").addClass("diet-labels");

  // Loop and add each diet label to the element
  for (let i = 0; i < dietLabels.length; i++) {
    const label = $("<span>")
      .addClass("badge badge-pill badge-success recipe-label-badge")
      .text(dietLabels[i]);
    $(el).append(label);

    // // only append comma if index is before the last label here
    // if (i < dietLabels.length - 1) {
    //   $(el).append(", ")
    // }
  }
  return el.html();
}

// Return a table of vitamins and minerals data for the given recipe
function renderVitAndMins(recipe) {
  let totalDailyPercentage = recipe.totalDaily;
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
  const tbody = $("<tbody>").addClass("vit-and-minerals-body"); // This must be a class as there are many on the page at the same time

  for (const key in totalDailyPercentage) {
    if (totalDailyPercentage.hasOwnProperty(key)) {
      let vitAndMineralsName = totalDailyPercentage[key].label;
      let vitAndMineralsQuantity = totalDailyPercentage[key].quantity.toFixed(1);

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

          $(tbody).append(tableRow);
          $(tbody).append(thinLine);

          firstColumnEmpty = true;
        }
      }
    }
  }

  // Create table
  const table = $("<table>").addClass("vit-and-minerals-table");

  // Add tbody to table
  $(table).append(tbody);

  // Return rendered html
  return table.prop("outerHTML");
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
      if (recipe.recipe.uri === uri) {
        // Prevent adding more than one by exiting the function
        return true;
      }
    }

    // Add to the end of the array
    favouriteRecipes.push(recipe);

    // Replace localStorage favourites with new (stringified) array of recipes
    localStorage.setItem("recipeSearch_favouriteRecipes", JSON.stringify(favouriteRecipes));

    return true;
  }
}

// Remove recipe from favourites
function removeFavouriteRecipe(uri) {
  if (!uri) {
    return false;
  } else {
    // loop the favouriteRecipes array and look for uri
    for (let i = 0; i < favouriteRecipes.length; i++) {
      // if a match is found;
      const arrayUri = favouriteRecipes[i].recipe.uri;
      if (uri === arrayUri) {
        // remove from favouriteRecipes array
        favouriteRecipes.splice(i, 1);

        // Replace localStorage favourites with new (stringified) array of recipes
        localStorage.setItem("recipeSearch_favouriteRecipes", JSON.stringify(favouriteRecipes));
        return true;
      }
    }
  }
}

// Event listener on recipe favourite button in modal
$("#favouriteRecipesEditModal").on("click", ".recipe-favourite", function (e) {
  // Uri of recipe
  const uri = $(this).attr("data-uri");

  removeFavouriteRecipe(uri);

  renderFavourites();
});

// Event listener on recipe favourite button to add to favourites array ("favouriteRecipes") and localStorage ("recipeSearch_favouriteRecipes")
$("#recipe-results").on("click", ".recipe-favourite", function (e) {
  // Get the index of the recipe on the page
  const index = $(this).attr("data-index");

  // Is this a favourite
  const favourite = $(this).attr("data-fav");

  // Uri of recipe
  const uri = $(this).attr("data-uri");

  // If there is no info about fav or it is false then make it a favourite
  if (!favourite || favourite === "false") {
    // Add it to favourite recipes
    if (addFavouriteRecipe(recipeResultData[index])) {
      // set icon
      $(this).find(".bi-heart").removeClass("bi-heart").addClass("bi-heart-fill");

      //Set data attribute
      $(this).attr("data-fav", "true");
    }
  } else {
    // Conditionally call removeFavouriteRecipe(uri) but set data-fav to "false" and switch the icon classes
    if (removeFavouriteRecipe(uri)) {
      // set icon
      $(this).find(".bi-heart-fill").removeClass("bi-heart-fill").addClass("bi-heart");

      //Set data attribute
      $(this).attr("data-fav", "false");
    }
  }
  // Rerender the favourites if it is visible
  if (!$("#recipe-favourites-section").hasClass("d-none")) {
    renderFavourites();
  }
});

// API fetch Recipes
async function fetchRecipes(queryUrl) {
  try {
    // await response call
    let response = await fetch(queryUrl);

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
