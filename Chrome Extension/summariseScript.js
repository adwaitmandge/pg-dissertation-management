// content_script.js

const addUrlToChatPdf = async (link) => {
  const apiUrl = "https://api.chatpdf.com/v1/sources/add-url";
  const apiKey = "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r";

  const headers = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  const data = {
    url: link,
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    console.log(response);
    console.log("Source ID:", response.sourceId);
    sourceId = response.sourceId;
    return sourceId;
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Response:", error.response?.data);
  }
};

async function processMessage(chatMessages, sourceId) {
  // messages is an array of messages
  // Format messages for chatGPT API
  // API is expecting objects in the format of { role: "user" or "assistant", "content": "message here"}
  // So we need to reformat

  let apiMessages = chatMessages.map((messageObject) => {
    let role = "";
    if (messageObject.sender === "ChatGPT") {
      role = "assistant";
    } else {
      role = "user";
    }
    return { role: role, content: messageObject.message };
  });

  const apiUrl = "https://api.chatpdf.com/v1/chats/message";
  const apiKey = "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r";

  const headers = new Headers({
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  });

  const data = {
    sourceId: sourceId,
    messages: [...apiMessages],
  };

  const res = await fetch("http://localhost:5000/api/thesis/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const someData = await res.json();
  console.log(someData);
  return someData;

  // return fetch(apiUrl, {
  //   method: "POST",
  //   headers: headers,
  //   body: data,
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error(`Request failed with status ${response.status}`);
  //     }
  //     return response.json();
  //   })
  //   .then((responseData) => {
  //     return [
  //       {
  //         message: responseData.content,
  //         sender: "ChatGPT",
  //       },
  //     ];
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error.message);
  //     // Handle error here
  //   });
}

const handleSend = async (message, sourceId) => {
  const newMessage = {
    message,
    direction: "outgoing",
    sender: "user",
  };

  const newMessages = [newMessage];

  // Initial system message to determine ChatGPT functionality
  // How it responds, how it talks, etc.
  if (sourceId) {
    const result = await processMessage(newMessages, sourceId);
    return result;
  } else {
    console.error(
      "sourceId is null. Make sure addUrlToChatPdf has completed before sending messages."
    );
  }
};

// Function to interact with the DOM elements
async function manipulateDOM() {
  console.log("hoisfaj");
  // Example: Changing the background color of all paragraphs to red
  let researchPaperText = "";

  const tweetContainer = document
    .querySelector("section")
    .querySelector("div")
    .querySelectorAll("p");
  console.log("About to display the element");
  console.log(tweetContainer);

  for (const paragraph of tweetContainer) {
    researchPaperText += paragraph.innerText;
    researchPaperText += "#";
  }
  console.log(researchPaperText);

  console.log("About to generate the pdf");

  const body = { data: researchPaperText };

  const res = await fetch("http://localhost:5000/api/thesis", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("After");
  const data = await res.json();
  console.log(data);

  // Source id generated
  const response = await addUrlToChatPdf(data.data);
  console.log(response);
  // handleSend
  const result = await handleSend(
    "Summarize the document in 600 words",
    response
  );
  console.log(result);
  console.log(result.result.content);

  const divElement = document
    .querySelector("div")
    .children.item(6)
    .querySelector("div")
    .querySelector("div")
    .querySelector("div");
  console.log(divElement);

  divElement.querySelector("ul").style.display = "none";
  const summaryElement = document.createElement("div");
  summaryElement.innerText = result.result.content;

  divElement.appendChild(summaryElement);
}

// Execute the function when the content script is injected into the page
setTimeout(manipulateDOM, 5000);

// async function apicall() {
//   const res = await fetch("https://dummyjson.com/products");
//   const data = await res.json();
//   console.log(data);
// }

// apicall();
