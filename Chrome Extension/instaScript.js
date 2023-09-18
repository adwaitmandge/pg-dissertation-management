// content_script.js

// Function to interact with the DOM elements
function manipulateDOM() {
  console.log("hoisfaj");
  // Example: Changing the background color of all paragraphs to red

  setInterval(() => {
    const postContainer = document
      .querySelector("main")
      .querySelector("section")
      .querySelectorAll("article");
    console.log("About to display the element");
    console.log(postContainer);

    for (const article of postContainer) {
      const post = article.querySelector("h1");
      console.log(post.innerText);
    }
  }, 4000);
  // tweet.style.backgroundColor = "red";
}

// Execute the function when the content script is injected into the page
manipulateDOM();

// async function apicall() {
//   const res = await fetch("https://dummyjson.com/products");
//   const data = await res.json();
//   console.log(data);
// }

// apicall();
