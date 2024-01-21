
// todo: formating for nutritional information
// todo: add contact links
// todo: user input error handle works but console log will still throw an error
// todo: local storage - save favourite recipes

// assign global variables
const NUTRITIONAL_API_ID = "9a70d71a";
const  NUTRITIONAL_API_KEY = "7fc8d04c2f9d72df3a6d50790e97e17e";

const nutriCardNutrients = ["FAT", "FASAT", "CHOLE", "NA", "CHOCDF", "FIBTG", "SIGAR", "PROCNT"];
const allVitAndMinerals = ["CA", "FE", "K", "MG", "NIA", "P", "RIBF", "THIA", "TOCPHA", "VITA_RAE", "VITB6A", "VITB12", "VITC", "VITD", "VITK1", "ZN"];

function handleUserInputError(errorCode) {
    if (errorCode === 555) {
    $("#custom-search-input-error").text(` We cannot calculate the nutrition for some ingredients. Please check the ingredient spelling or if you have entered a quantities for the ingredients.`)
    } else {
      $("#custom-search-input-error").text(`test`)
    }
}

// wait for page to fullly load & event listener for analyse button
$(document).ready(function() {
  $('#custom-analysis-button').click(function(event) {
      event.preventDefault(); // This will prevent the default action of the button
      // clear existing messages
      captureUserInput()
  });
});

function captureUserInput() {
  userIngridients = $("#custom-search-input").val();
  // check user has filled in something
  if (userIngridients) {
    // fetchNutriInfo to see if repsonse is valid
    fetchNutritionalInfo(userIngridients).then(response => {
      if (response.success) {
        $("#custom-search-input").text("")
        customAnalysis(response.data)
      } else {
        $("#custom-search-input").text("")
        handleUserInputError(response.errorCode)
      }
      });
    } else {
      $("#custom-search-input-error").text(`Please type in the name of ingreidnts and the quantity of each.`)
    }
}

 //  customAnalysis(userIngridients);
async function fetchNutritionalInfo(userIngridients) {
  try {
    
    // Define the body of the request
    const nutritionalParameters = {
      ingr: [userIngridients], 
    };
    // Define the request URL
    const nutritionalURL = `https://api.edamam.com/api/nutrition-details?app_id=${NUTRITIONAL_API_ID}&app_key=${NUTRITIONAL_API_KEY}`;
    // Make a POST request
    const response = await fetch(nutritionalURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nutritionalParameters)
    });

    let data = await response.json();

    if (response.status === 200) {
      return { success: true, data};
    } else {
      return { success: false, errorCode: response.status };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, errorCode: response.status, errorMessage: error.message };
  }
};

// fetchNutritionalInfo();

// render custom analysis
function customAnalysis(data) {
  console.log(userIngridients)

  
  
  // display nutri info sections
  $("#nutritional-info").removeClass("d-none");

  // clear existing info 
  $(".diet-labels").empty();
  $(".health-labels").empty();
  $("#vit-and-minerals-body").empty();

  // display what user searched 
  $("#display-user-ingredients").removeClass("d-none");

  let displayUserSearchHeader = $("<h5>")
  .text("Analysing for:")
  $("#display-user-ingredients").append(displayUserSearchHeader)

  let userSearchedText = $("<p>")
  .text(`${userIngridients}`);

  $("#display-user-ingredients").append(userSearchedText);
    
  console.log(data);

  // diet labels
  let dietLabels = data.dietLabels;
  console.log(dietLabels);

  for (let i = 0; i < dietLabels.length; i++) {
    const dietBadge = $("<span>")
    .addClass("badge label-badge")
    .text(dietLabels[i]);
    $(".diet-labels").append(dietBadge)
  }

  // health labels

  // health labels to remove from list API list
  let unwantedHealthLabels = ["SULPHITE_FREE","SESAME_FREE","SUGAR_CONSCIOUS","SPECIFIC_CARBS","MILK_FREE","FISH_FREE","WHEAT_FREE","MEDITERRANEAN", "DASH", "EGG_FREE","RED_MEAT_FREE","CELERY_FREE","MUSTARD_FREE","LUPINE_FREE","ALCOHOL_FREE","NO_OIL_ADDED","NO_SUGAR_ADDED","FODMAP_FREE" ];

  let healthLabels = data.healthLabels;
  // new array with unwanted health lables filtered out
  let healthLabelsToKeep = healthLabels.filter(item => !unwantedHealthLabels.includes(item));
  console.log(healthLabelsToKeep)

  for (let i = 0; i < healthLabelsToKeep.length; i++) {
    const healthBadge = $("<span>")
    .addClass("badge label-badge")
    .text(healthLabelsToKeep[i]);
    $(".health-labels").append(healthBadge)
  }

  // NURTRITION CARD
  // calories
  // calories
  let calories = data.calories;
  console.log(calories);

  $("#total-calories").text(calories);

  // *** gives you in quantity and units
  let totalNutrients = data.totalNutrients;
  // console.log(totalNutrients);
  // total fat
  let totalFat = totalNutrients.FAT;
  $("#total-fats .quantity").text(totalFat.quantity.toFixed(1) + totalFat.unit);
  // saturated fat
  $("#saturated-fats .quantity").text(totalNutrients.FASAT.quantity.toFixed(1) + totalNutrients.FASAT.unit);
  // cholesterol
  $("#cholesterol .quantity").text(totalNutrients.CHOLE.quantity.toFixed(1) + totalNutrients.CHOLE.unit);
  // sodium
  $("#sodium .quantity").text(totalNutrients.NA.quantity.toFixed(1) + totalNutrients.NA.unit);
  // total carbs
  $("#total-carbs .quantity").text(totalNutrients.CHOCDF.quantity.toFixed(1) + totalNutrients.CHOCDF.unit);
  // fibre
  $("#fibre .quantity").text(totalNutrients.FIBTG.quantity.toFixed(1) + totalNutrients.FIBTG.unit);
  // suagrs 
  $("#sugar .quantity").text(totalNutrients.SUGAR.quantity.toFixed(1) + totalNutrients.SUGAR.unit);
  // protien
  $("#protein .quantity").text(totalNutrients.PROCNT.quantity.toFixed(1) + totalNutrients.PROCNT.unit);

  // *** gives you % of daily rec
  let totalDailyPercentage = data.totalDaily;
  console.log(totalDailyPercentage);
  // total fat
  $("#total-fats .percentage").text(`${totalDailyPercentage.FAT.quantity.toFixed(1)}%`);
  // saturated fat
  $("#saturated-fats .percentage").text(`${totalDailyPercentage.FASAT.quantity.toFixed(1)}%`);
  // cholesterol
  $("#cholesterol .percentage").text(`${totalDailyPercentage.CHOLE.quantity.toFixed(1)}%`);
  // sodium
  $("#sodium .percentage").text(`${totalDailyPercentage.NA.quantity.toFixed(1)}%`);
  // total carbs
  $("#total-carbs .percentage").text(`${totalDailyPercentage.CHOCDF.quantity.toFixed(1)}%`);
  // fibre
  $("#fibre .percentage").text(`${totalDailyPercentage.FIBTG.quantity.toFixed(1)}%`);
  // suagrs
  // $("#sugar .percentage").text(`${totalDailyPercentage.SUGAR.quantity.toFixed(1)}%`);
  // protien
  $("#protein .percentage").text(`${totalDailyPercentage.PROCNT.quantity.toFixed(1)}%`);

  // vitamins and minerals
  let firstColumnEmpty = true;
  let tableRow = null;
  // loop through object   
  for (const key in totalDailyPercentage) {
    if (totalDailyPercentage.hasOwnProperty(key)) {
      let vitAndMineralsName = totalDailyPercentage[key].label;
      let vitAndMineralsQuantity = totalDailyPercentage[key].quantity.toFixed(1);
      // console.log(vitAndMineralsName);    
      // console.log(key);      

      // filter out zero quantities && if the key is a nutrient in the allVitAndMinerals array 
      // (to avoid duplicate nutrients already added in nutri card)
      // dynamically render vitamins onto nutrition card      
      if ((vitAndMineralsQuantity > 0 && allVitAndMinerals.includes(key))) {
        if(firstColumnEmpty){
          tableRow = $("<tr>")
          .addClass("vitamin-row"); 

          let tableDataOne = $("<td>")
          .text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

          tableRow.append(tableDataOne);

          firstColumnEmpty = false;
        } else {
          let tableDataTwo = $("<td>")
          .text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

          tableRow.append(tableDataTwo);

          let thinLine = $("<tr>")
          .addClass("thin-end");

          $("#vit-and-minerals-body").append(tableRow);
          $("#vit-and-minerals-body").append(thinLine)

          firstColumnEmpty = true;
        }
      }
    }
  }
}

// $(document).ready(function organiseData() {
//   let data = JSON.parse(localStorage.getItem('savedData'));
//   console.log(data);
// //   let totalDailyPercentage = data.totalDaily;
// //   console.log(totalDailyPercentage);
// //   // console.log(totalDailyPercentage);
// //   // console.log(Object.keys(totalDailyPercentage))

//   // display what user searched 
//   // let userSearchedText = $("<p>")
//   // .text(userIngridients);

//   // $("#display-user-ingredients").append(userSearchedText);

//   // diet labels
//   let dietLabels = data.dietLabels;
//   console.log(dietLabels);

//   for (let i = 0; i < dietLabels.length; i++) {
//     const dietBadge = $("<span>")
//     .addClass("badge label-badge")
//     .text(dietLabels[i]);
//     $(".diet-labels").append(dietBadge)
//   }

//   // health labels

//   // health labels to remove from list API list
//   let unwantedHealthLabels = ["SULPHITE_FREE","SESAME_FREE","SUGAR_CONSCIOUS","SPECIFIC_CARBS","MILK_FREE","FISH_FREE","WHEAT_FREE","MEDITERRANEAN", "DASH", "EGG_FREE","RED_MEAT_FREE","CELERY_FREE","MUSTARD_FREE","LUPINE_FREE","ALCOHOL_FREE","NO_OIL_ADDED","NO_SUGAR_ADDED","FODMAP_FREE" ];

//   let healthLabels = data.healthLabels;
//   // new array with unwanted health lables filtered out
//   let healthLabelsToKeep = healthLabels.filter(item => !unwantedHealthLabels.includes(item));
//   console.log(healthLabelsToKeep)

//   for (let i = 0; i < healthLabelsToKeep.length; i++) {
//     const healthBadge = $("<span>")
//     .addClass("badge label-badge")
//     .text(healthLabelsToKeep[i]);
//     $(".health-labels").append(healthBadge)
//   }
  
// });

