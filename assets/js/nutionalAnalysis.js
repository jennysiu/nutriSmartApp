const NUTRITIONAL_API_ID = "9a70d71a";
const  NUTRITIONAL_API_KEY = "7fc8d04c2f9d72df3a6d50790e97e17e";

// parameters for fetch
// let nutritionalParameters = {
//   "title": "string",
//   "ingr": ["string"],
//   "url": "string",
//   "summary": "string",
//   "yield": "string",
//   "time": "string",
//   "img": "string",
//   "prep": "string"
// }

async function fetchNutritionalInfo() {
  try {
    // Define the body of the request
    const nutritionalParameters = {
      // title: "Chicken Paprikash", // Example title
      ingr: ["500g tofu"], // Example ingredients
      // yield: "string"
      // Additional fields can be added here as needed
    };

    // Define the request URL
    const nutritionalURL = `https://api.edamam.com/api/nutrition-details?app_id=${NUTRITIONAL_API_ID}&app_key=${NUTRITIONAL_API_KEY}`;

    // Make a POST request
    let response = await fetch(nutritionalURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nutritionalParameters)
    });

    // Convert response to JSON
    let data = await response.json();
    // console.log(data);

    // Return the data
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// fetchNutritionalInfo();

// event listener for analyse button and waits for page to fully load
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('custom-analysis-button').addEventListener('click', function(event) {
      event.preventDefault(); // This will prevent the default action of the button
      customAnalysisButton();
  });
});

function customAnalysisButton() {
  // Using the async function
  fetchNutritionalInfo().then(data => {
    console.log(data);
    // assign data variables here (ouotputs we need)
    // filter data to data variables

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
    // needs to be filtered out

    let healthLabels = data.healthLabels;
    console.log(healthLabels);

    for (let i = 0; i < healthLabels.length; i++) {
      const healthBadge = $("<span>")
      .addClass("badge label-badge")
      .text(healthLabels[i]);
      $(".health-labels").append(healthBadge)
    }
    
    // calories
    let calories = data.calories;
    console.log(calories);

    // *** gives you % of daily rec
    let totalDailyPercentage = data.totalDaily;
    console.log(totalDailyPercentage);

    // macronutrients - protein
    let proteinDailyPercentageInfo = totalDailyPercentage.PROCNT;
    console.log(proteinDailyPercentageInfo)
    renderNutritionInfoInArray($(".nutrition-row-protein"),proteinDailyPercentageInfo)


    // macronutrients - carbohydrates

    // macronutrients - fats

    // *** gives you in units
    let totalNutrients = data.totalNutrients;
    console.log(totalNutrients);



    // gives you calories from different forms
    let totalNutrientsKCal = data.totalNutrientsKCal;
    console.log(totalNutrientsKCal);

    localStorage.setItem('savedData', JSON.stringify(data));
  })
  console.log("dinng")
}

$(document).ready(function organiseData() {
  let data = JSON.parse(localStorage.getItem('savedData'));
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
    // needs to be filtered out

    let healthLabels = data.healthLabels;
    console.log(healthLabels);

    for (let i = 0; i < healthLabels.length; i++) {
      const healthBadge = $("<span>")
      .addClass("badge label-badge")
      .text(healthLabels[i]);
      $(".health-labels").append(healthBadge)
    }
    
    // calories
    let calories = data.calories;
    console.log(calories);

    // *** gives you % of daily rec
    let totalDailyPercentage = data.totalDaily;
    console.log(totalDailyPercentage);

    // macronutrients - protein
    let proteinDailyPercentageInfo = totalDailyPercentage.PROCNT;
    console.log(proteinDailyPercentageInfo)


    // macronutrients - carbohydrates

    // macronutrients - fats

    // *** gives you in units
    let totalNutrients = data.totalNutrients;
    console.log(totalNutrients);


});

// organiseData() 

// funtion to create for-loop based on array length size
function renderNutritionInfoInArray(parent, array) {
  for (let i = 0; i < array.length; i++) {
    console.log(array)
    let nutrientName = $("<span>")
    .addClass("nutrient-nutrientName")
    .text(array[i].label);

    let nutrientQuantity = $("<span>")
    .addClass("nutrient-quantity")
    .text(array[i].quantity);;

    let unit = $("<span>")
    .addClass("nutrient-unit")
    .text(array[i].unit);



    parent.append(nutrientName, nutrientQuantity, unit);
  }
}

