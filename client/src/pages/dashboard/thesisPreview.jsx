import { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import FileUploadComponent from "./fileupload";
import { useLocation } from "react-router-dom";
import DocViewer, { PDFRenderer, DocViewerRenderers } from "react-doc-viewer";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import { UserState } from "@/context/UserProvider";

function ThesisPreview() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sourceId, setSourceId] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [text, setText] = useState("");
  const [result, setResult] = useState();
  const [feedback, setFeedback] = useState("");
  const { user } = UserState();
  const location = useLocation();
  const { thesis } = location.state;
  console.log(thesis);

  const cloudinaryLink = thesis.cloudinaryLink; // Assuming 'cloudinaryLink' is the property name
  console.log(cloudinaryLink);

  function str2xml(str) {
    if (str.charCodeAt(0) === 65279) {
      // BOM sequence
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  }

  const sendFeeback = async (status) => {
    const body = {
      id: thesis._id,
      newStatus: status,
      feedback,
    };

    try {
      const res = await fetch("http://localhost:5000/api/thesis/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function getParagraphs(content) {
    console.log("Inside getparas");

    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
  }

  const onUrlUpload = async (url) => {
    try {
      const response = await fetch(url);
      console.log(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const paragraphs = getParagraphs(content);
        const newText = paragraphs.join(" ");
        setText(newText);
        checkPlagiarism(newText);
        // console.log(newText);
        setParagraphs(paragraphs);
      };

      reader.onerror = (err) => console.error("File reader error:", err);

      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error("Error fetching the DOCX file from URL:", error);
    }
  };

  const checkPlagiarism = async (text) => {
    console.log("INside plagai");
    try {
      const response = await axios.post(
        "https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism",
        {
          text,
          language: "en",
          includeCitations: false,
          scrapeSources: false,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "4642336211mshda189de3c3f26aep1ff74fjsnb587261e6d07",
            "X-RapidAPI-Host":
              "plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com",
          },
        }
      );

      console.log(response.data);
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const docs = [
    {
      uri: cloudinaryLink,
    },
  ];

  // console.log(paragraphs);
  return (
    <div className="h-full flex-col">
      <div>
        <DocViewer
          className="h-auto"
          pluginRenderers={DocViewerRenderers}
          documents={docs}
        />
      </div>
      {user?.role == "Mentor" && (
        <button
          onClick={() => onUrlUpload(cloudinaryLink)}
          type="button"
          class="mr-2 mt-3 mb-2 inline-flex h-12 w-[100%] items-center justify-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-lg font-medium text-white hover:bg-[#050708]/90 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
        >
          Plagiarism Detector
        </button>
      )}

      {result && (
        <div>
          <h3>Plagiarism Check Result</h3>
          <p>Percent Plagiarism: {result.percentPlagiarism}%</p>
          {result.sources.length > 0 && (
            <div>
              <h4>Sources:</h4>
              <ul>
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <p>Title: {source.title}</p>
                    <p>
                      URL: <a href={source.url}>{source.url}</a>
                    </p>
                    <p>Match Text: {source.matches[0].matchText}</p>{" "}
                    {/* Displaying the first match as an example */}
                    <p>Score: {source.matches[0].score}</p>{" "}
                    {/* Displaying the score of the first match */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-center">
        {user?.role == "Mentor" && (
          <>
            <div class="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
              <div class="rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                <label for="comment" class="sr-only">
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows="10"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  class="w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Write a comment..."
                  required
                ></textarea>
              </div>
              <div class="flex flex-col items-center justify-center border-t px-3 py-2 dark:border-gray-600">
                <button
                  onClick={() => sendFeeback("Accept")}
                  type="button"
                  class="mr-2 mb-2 w-full rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => sendFeeback("Reject")}
                  class="mr-2 mb-2 w-full rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Reject
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ThesisPreview;
