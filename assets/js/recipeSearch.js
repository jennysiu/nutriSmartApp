const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

let keyword = "chicken"

let recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&q=${keyword}`;


// Array of common ingredients for populating the buttons

// Array of favourite recipe IDs taken from localStorage

// Populate the common ingredients button from the array of ingredients

// Function to populate the ingredients buttons to the array to search with (in tag)

// Function to fetch a given recipes using search

// Event listener on the recipe search form (submit) to initiate a search

// Event listener on recipe favourite button to add to favourites and localStorage

async function fetchRecipes() {
    try {
      // await response call
      console.log("Requesting:", recipeSearchURL); 
      let response = await fetch(recipeSearchURL);
      console.log("Response Status:", response.status);

      // once response retrieved, convert to json format
      let data = await response.json();

      console.log(data);

      // return data
      return data;
    } catch (error) {
      // console error message
      console.error("Fetch error:", error)
    }
};


fetchRecipes().then(data => {
  console.log(data);
  // assign data variables here (outputs we need)
  // filter data to data variables
});

