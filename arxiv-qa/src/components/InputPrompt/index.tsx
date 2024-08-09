import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

// Define types for the props

interface UserInputProps {
	onReceiveUserInput: (input: string) => Promise<void>;
}

// User input area style
const textareaStyle: React.CSSProperties = {
	resize: "none",
	overflow: "hidden",
	minHeight: "65px",
	fontFamily: "Arial",
	fontSize: "20px",
	alignItems: "center",
	fontWeight: "bold",
	marginBottom: "10px",
};

export function InputPrompt({ onReceiveUserInput }: UserInputProps) {
	const [userText, setUserText] = useState("");
	const [loading, setLoading] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = textareaRef.current;
		setUserText(e.target.value);
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	const handleSendEvent = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			console.log("Enter key pressed");
			sendInput();
		}
	};

	// Clear the user input
	const cleanInput = () => {
		setUserText("");
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
		}
	};

	// Send the user input
	const sendInput = () => {
		if (userText.trim() === "") {
			alert("Please enter questions");
			return;
		}
		setLoading(true);
		// analyze answers for the user input
		onReceiveUserInput(userText).finally(() => {
			setLoading(false);
		});

		cleanInput();
	};

	return (
		<div className="text-input">
			<textarea
				ref={textareaRef}
				id="userText"
				className="form-control"
				value={userText}
				onChange={handleTextChange}
				onKeyDown={handleSendEvent}
				placeholder="👂🏼Listening to your sentiment..."
				style={textareaStyle}
			/>
			<SendButton disabled={loading} onClick={sendInput} />
		</div>
	);
}

interface SendButtonProps {
	disabled: boolean;
	onClick: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick }) => {
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
};
