import React, { useState, useRef } from "react";

//User input area style
const textareaStyle = {
  resize: "none",
  overflow: "hidden",
  minHeight: "65px",
  fontFamily: "Arial",
  fontSize: "20px",
  alignItems: "center",
  fontbold: "true",
  marginBottom: "10px",
};

export default function UserInput({ onReceiveUserInput }) {
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  /**
   * resize the textarea based on the user input
   * @param {InputEvent} e
   */
  const handleTextChange = (e) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    setUserText(e.target.value);
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  /**
   * Ctrl+Enter or Cmd+Enter to send the user input
   * @param {KeyboardEvent} e
   */
  const handleKeyDown = (e) => {
    e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      console.log("Enter key pressed");
      sendInput();
    }
  };

  //reset
  const resetUserInput = () => {
    setUserText("");
    setLoading(true);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  /**
   * Send the user input to get the sentiment prediction
   */
  const sendInput = () => {
    if (input === "") {
      alert("Please enter a sentiment");
      return;
    }
    //Predict the sentiment from the user input
    onReceiveUserInput(userText);

    //reset the user input
    resetUserInput();
  };

  return (
    <div style={{ margin: "20px 0", width: "50vw" }}>
      <textarea
        ref={textareaRef}
        id="userText"
        className="form-control"
        value={userText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your sentiment here..."
        style={textareaStyle}
      />
      <button
        className="btn btn-primary"
        type="button"
        disabled={loading}
        style={{ float: "right" }}
        onClick={sendInput}
      >
        {loading && (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        {loading ? "Loading..." : "Send"}
      </button>
    </div>
  );
}
