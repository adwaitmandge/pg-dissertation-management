// content_script.js

// Function to interact with the DOM elements
function manipulateDOM() {
  // Example: Changing the background color of all paragraphs to red
  console.log("Inside the manipulateDOM function");
  console.log("This looks good");
  const tweets = document.querySelector("body");
  console.log(tweets);
}

// Execute the function when the content script is injected into the page
manipulateDOM();
