// replace with own API data
const RECIPE_SEARCH_API_ID = "f2f4ac30";
const RECIPE_SEARCH_API_KEY = "718e862b4ce3b44d9cf1b8a149daf83c";

let keyword = "chicken"

let recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&q=${keyword}`;


async function fetchRecipes() {
    try {
      // await response call
      console.log("Requesting:", recipeSearchURL); 
      let response = await fetch(recipeSearchURL);
      console.log("Response Status:", response.status);

      // once response retrieved, convert to json format
      let data = await response.json();

      // console.log(data);

      // return data
      return data;
    } catch (error) {
      // console error message
      console.error("Fetch error:", error)
    }
};

// fetchRecipes()

// Using the async function
// fetchRecipes().then(data => {
  // console.log(data);
  // assign data variables here (ouotputs we need)
  // filter data to data variables
// });

