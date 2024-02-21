import React, { Component } from "react";
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

export default class UserInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userText: "",
      loading: false,
    };
    this.textareaRef = React.createRef();
  }

  handleTextChange = (e) => {
    e.preventDefault();
    const textarea = this.textareaRef.current;
    this.setState({ userText: e.target.value }, () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  };

  handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      console.log("Enter key pressed");
      this.sendInput();
    }
  };

  sendInput = () => {
    //Predict the sentiment from the user input
    this.props.addSentiPredictFromUser(this.state.userText);

    //Clear the input field
    this.setState({ userText: "", loading: true }, () => {
      const textarea = this.textareaRef.current;
      textarea.style.height = "auto";
    });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  };

  render() {
    const { userText, loading } = this.state;
    return (
      <div style={{ margin: "20px 0", width: "50vw" }}>
        <textarea
          ref={this.textareaRef}
          id="userText"
          className="form-control"
          value={userText}
          onChange={this.handleTextChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Type your sentiment here..."
          style={textareaStyle}
        />
        <button
          className="btn btn-primary"
          type="button"
          disabled={loading}
          style={{ float: "right" }}
          onClick={this.sendInput}
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
}
