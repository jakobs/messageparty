import React from "react";

export default function MessageInput({ sendMessage, type }) {
	const MAX_LENGTH = 96;

	return (
		<>
			<input type="text" id="author" placeholder="Absender" />
			<div className="container">
				<textarea
					id="content"
					placeholder="Nachricht"
					maxLength={MAX_LENGTH}
					onChange={() => {
						document.getElementById("characters-left").innerText = `${
							MAX_LENGTH - document.getElementById("content").value.length
						}`;
					}}
				/>
				<span className="characters-left" id="characters-left">
					{MAX_LENGTH}
				</span>
			</div>
			<input
				type="button"
				value={type === "host" ? "Anzeigen" : "Vorschlagen"}
				onClick={() => {
					const author = document.getElementById("author").value;
					const content = document.getElementById("content").value;
					sendMessage({ author, content });
				}}
			/>
		</>
	);
}
