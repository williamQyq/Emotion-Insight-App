import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

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

UserInput.propTypes = {
	transcribedData: PropTypes.shape({
		chunks: PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string,
			}),
		),
	}),
	onReceiveUserInput: PropTypes.func.isRequired,
};

export default function UserInput({ transcribedData, onReceiveUserInput }) {
	const [userText, setUserText] = useState("");
	const [loading, setLoading] = useState(false);
	const textareaRef = useRef(null);

	const handleTranscript = (transcribedData) => {
		return transcribedData?.chunks
			? transcribedData.chunks
					.reduce((text, chunk) => `${text} ${chunk.text}`, "")
					.trim()
			: "";
	};

	useEffect(() => {
		// concatenate the transcript data to the user input
		const newInput = handleTranscript(transcribedData);
		console.log("New input is: ", newInput);
		setUserText(newInput.trim()); // Trim any extra space at the start or end
	}, [transcribedData?.chunks]);
	/**
	 * resize the textarea based on the user input
	 * @param {InputEvent} e
	 */
	const handleTextChange = (e) => {
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
		if (userText.trim() === "") {
			alert("Please enter a sentiment");
			return;
		}
		//Predict the sentiment from the user input
		onReceiveUserInput(userText);

		//reset the user input
		resetUserInput();
	};

	return (
		<div className="text-input">
			<textarea
				ref={textareaRef}
				id="userText"
				className="form-control"
				value={userText}
				onChange={handleTextChange}
				onKeyDown={handleKeyDown}
				placeholder="👂🏼Listening to your sentiment..."
				style={textareaStyle}
			/>
			<SendButton disabled={loading} onClick={sendInput} />
		</div>
	);
}

function SendButton({ disabled, onClick }) {
	return (
		<button
			className="btn btn-primary"
			style={{ float: "right" }}
			type="button"
			disabled={disabled}
			onClick={onClick}
		>
			{disabled ? (
				<>
					<span
						className="spinner-border spinner-border-sm"
						role="status"
						aria-hidden="true"
					/>{" "}
					Loading...
				</>
			) : (
				<span>Send</span>
			)}
		</button>
	);
}
SendButton.propTypes = {
	disabled: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};
