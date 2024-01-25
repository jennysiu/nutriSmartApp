
const RECIPE_SEARCH_API_ID = "f2f4ac30";
const RECIPE_SEARCH_API_KEY = "718e862b4ce3b44d9cf1b8a149daf83c";

// API search (this is here to just grab the initial data so i can start building the pagination)
async function fetchRecipes() {
  try {
    // Get search terms from array of search terms
    // const tags = ingredientsSearch.join("+");

    let tags = "aubergine"

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

    // SAVING DATA TO LOCAL STORAGE HERE TO FOR BUILDING PAGINATION
    console.log(data)
    localStorage.setItem("recipesData", JSON.stringify(data))

    // return data
    return data;
  } catch (error) {
    // console error message
    console.error("Fetch error:", error);
  }
}

// run this once to get your first set of data (for building purposes)
// fetchRecipes();

// Event listener on next button in pagination navbar
$("#recipe-results").on("click", "#pagination-next", function (e) {
  recipeResultsPagination()
});

function recipeResultsPagination() {
  // will need to use local storage to store the nextPageURL from the original fetch & remove after so local storage is clean
  recipesData = JSON.parse(localStorage.getItem("recipesData"));
  console.log(recipesData)
  let nextPageURL = recipesData._links.next.href;
  console.log(nextPageURL)

  fetchNextPageRecipes(nextPageURL);
}

recipeResultsPagination();

// this will give you the next set of 20 recipes
async function fetchNextPageRecipes(nextPageURL) {
  try {
    // Get search terms from array of search terms
    // const tags = ingredientsSearch.join("+");

    // Construct search URL
    nextPageURL = `${nextPageURL}`;

    // await response call
    let response = await fetch(nextPageURL);

    // once response retrieved, convert to json format
    let data = await response.json();

    console.log(data)

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

