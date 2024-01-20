// ! todo: find sugar
// ! todo: add units to nutrients
// ! todo: add vitamins
// ! todo: add search logic
// todo: formating for nutritional information
// ! todo: app name
// todo: add contact links
// todo: add error handling for user input
// todo: local storage - save favourite recipes
//  todo: filter out some health lables

const NUTRITIONAL_API_ID = "9a70d71a";
const  NUTRITIONAL_API_KEY = "7fc8d04c2f9d72df3a6d50790e97e17e";

// wait for page to fullly load & event listener for analyse button
document.addEventListener('DOMContentLoaded', (event) => {
  $('#custom-analysis-button').click(function(event) {
      event.preventDefault(); // This will prevent the default action of the button
      // let userIngridients = $(".search-input").val();
      customAnalysisButton();
  });
});

async function fetchNutritionalInfo(userIngridients) {
  try {
    // Define the body of the request
    const nutritionalParameters = {
      // title: "Chicken Paprikash", // Example title
      ingr: [userIngridients], // Example ingredients
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

function customAnalysisButton() {

  // let userIngridients = $(".search-input").val();
  let userIngridients = "1 chicken" 
  
  // Using the async function
  fetchNutritionalInfo(userIngridients).then(data => {
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
    // todo: needs to be filtered out

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

    // *** gives you in quantity and iunits
    let totalNutrients = data.totalNutrients;
    console.log(totalNutrients);
    // total fat
    let totalFat = totalNutrients.FAT;
    $("#total-fats .quantity").text(totalFat.quantity + totalFat.unit);
    // saturated fat
    $("#saturated-fats .quantity").text(totalNutrients.FASAT.quantity.toFixed(1) + totalNutrients.FASAT.unit);
    // cholesterol
    $("#cholesterol .quantity").text(totalNutrients.CHOLE.quantity + totalNutrients.CHOLE.unit);
    // sodium
    $("#sodium .quantity").text(totalNutrients.NA.quantity + totalNutrients.NA.unit);
    // total carbs
    $("#total-carbs .quantity").text(totalNutrients.CHOCDF.quantity + totalNutrients.CHOCDF.unit);
    // fibre
    $("#fibre .quantity").text(totalNutrients.FIBTG.quantity + totalNutrients.FIBTG.unit);
    // suagrs 
    $("#sugar .quantity").text(totalNutrients.SUGAR.quantity + totalNutrients.SUGAR.unit);
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
    $("#sugar .percentage").text(`${totalDailyPercentage.SUGAR.quantity.toFixed(1)}%`);
    // protien
    $("#protein .percentage").text(`${totalDailyPercentage.PROCNT.quantity.toFixed(1)}%`);

    // vitamins and minerals
    // loop through object 
    for (const key in totalDailyPercentage) {
      if (totalDailyPercentage.hasOwnProperty(key)) {
        let vitAndMineralsName = totalDailyPercentage[key].label;
        let vitAndMineralsQuantity = totalDailyPercentage[key].quantity.toFixed(1);
        // console.log(vitAndMineralsName);    
        // console.log(vitAndMineralsQuantity);      
      
        // filter out zero quantities
        if ((vitAndMineralsQuantity > 0)) {
          // dynamically render vitamins onto nutrition card
          let tableRow = $("<tr>")
          .addClass("vitamin-row");

          let tableDataOne = $("<td>")
          .attr("colespan", "2")
          .text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

          let thinLine = $("<tr>")
          .addClass("thin-end");

          $("#vit-and-minerals-body").append(tableRow);
          $("#vit-and-minerals-body").append(tableDataOne, thinLine)
        }
      }
    }    

    localStorage.setItem('savedData', JSON.stringify(data));
  })
}

// $(document).ready(function organiseData() {
//   let data = JSON.parse(localStorage.getItem('savedData'));
//   console.log(data);
//   let totalDailyPercentage = data.totalDaily;
//   console.log(totalDailyPercentage);

//   // if label name is in list of minerals to show, then add onto list to display
//   // if quantity is larger than zero, include in display list
//   // render display list at bottom of nutritional card

//   // loop through object 
//   for (const key in totalDailyPercentage) {
//     if (totalDailyPercentage.hasOwnProperty(key)) {
//       let vitAndMineralsName = totalDailyPercentage[key].label;
//       let vitAndMineralsQuantity = totalDailyPercentage[key].quantity.toFixed(1);
//       // console.log(vitAndMineralsName);    
//       // console.log(vitAndMineralsQuantity);      
    
//       // filter out zero quantities
//       if ((vitAndMineralsQuantity > 0)) {
//         // dynamically render vitamins onto nutrition card
//         let tableRow = $("<tr>")
//         .addClass("vitamin-row");

//         let tableDataOne = $("<td>")
//         .attr("colespan", "2")
//         .text(`${vitAndMineralsName} ${vitAndMineralsQuantity} %`);

//         let thinLine = $("<tr>")
//         .addClass("thin-end");

//         $("#vit-and-minerals-body").append(tableRow);
//         $("#vit-and-minerals-body").append(tableDataOne, thinLine)
//       }
//     }
//   }
// });