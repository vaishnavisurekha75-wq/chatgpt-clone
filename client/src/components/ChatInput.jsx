import { useState, useRef } from "react";
import FileUpload from "./FileUpload";
import "../styles/InputBox.css";


function ChatInput({ sendMessage }) {

  const [text, setText] = useState("");
  const recognitionRef = useRef(null);


  // Send Message
  const handleSend = () => {

    if (!text.trim()) return;

    sendMessage(text);
    setText("");

  };


  // File Upload
  const handleFile = (file) => {

    console.log("Selected File:", file);


    if (file.type === "application/pdf") {

      sendMessage(
        `I uploaded a PDF file named "${file.name}". Please analyze this PDF file.`
      );

      return;

    }


    const reader = new FileReader();


    reader.onload = (e) => {

      const content = e.target.result;


      sendMessage(
        `Read this file and help me:\n\n${content}`
      );

    };


    reader.onerror = () => {

      alert("Unable to read file");

    };


    reader.readAsText(file);

  };



  // Enter key send
  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      e.preventDefault();
      handleSend();

    }

  };



  // Voice Input
  const startListening = () => {


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;



    if (!SpeechRecognition) {

      alert("Speech Recognition is not supported.");

      return;

    }



    if (recognitionRef.current) {

      recognitionRef.current.stop();

    }



    const recognition = new SpeechRecognition();


    recognitionRef.current = recognition;



    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;



    recognition.onstart = () => {

      console.log("🎤 Listening...");

    };



    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;


      setText(transcript);

    };



    recognition.onerror = (event) => {

      console.log("Speech Error:", event.error);

    };



    recognition.onend = () => {

      console.log("🎤 Recognition Ended");

    };



    recognition.start();

  };




  return (

    <div className="input-container">


      <input

        type="text"

        placeholder="Type your message..."

        value={text}

        onChange={(e)=>setText(e.target.value)}

        onKeyDown={handleKeyDown}

      />



      <FileUpload

        onFileSelect={handleFile}

      />



      <button

        className="mic-btn"

        onClick={startListening}

      >

        🎤

      </button>



      <button onClick={handleSend}>

        Send

      </button>


    </div>

  );

}


export default ChatInput;