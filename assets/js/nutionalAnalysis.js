const NUTRITIONAL_API_ID = "465508de";
const  NUTRITIONAL_API_KEY = "696e052a69960e957766fa240ab4aa4e";

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
      ingr: ["1 chicken", "2 tsp sugar", "3 tsp cumin"], // Example ingredients
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

fetchNutritionalInfo();

// Using the async function
fetchNutritionalInfo().then(data => {
  console.log(data);
  // assign data variables here (ouotputs we need)
  // filter data to data variables

  let dietLabels = data.dietLabels;
  console.log(dietLabels);

  let healthLabels = data.healthLabels;
  console.log(healthLabels);

  // gives you % of daily rec
  let totalDaily = data.totalDaily;
  console.log(totalDaily);

  // gives you in units
  let totalNutrients = data.totalNutrients;
  console.log(totalNutrients);

  // gives you calories from different forms
  let totalNutrientsKCal = data.totalNutrientsKCal;
  console.log(totalNutrientsKCal);

});