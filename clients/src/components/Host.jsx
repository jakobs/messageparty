import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import useWebSocket, { ReadyState } from "react-use-websocket";
import MessageProposal from "./MessageProposal";
import notificationUrl from "../assets/notification.mp3";
import spamAudioUrl from "../assets/spam.mp3";

export default function Host() {
	const [messages, setMessages] = useState([]);

	const { sendMessage, lastMessage, readyState } = useWebSocket(
		`ws://${window.location.host}/ws/host`,
		{
			share: false,
			shouldReconnect: () => true,
		}
	);

	useEffect(() => {
		if (lastMessage !== null) {
			setMessages((prevMessages) => [
				...prevMessages,
				JSON.parse(lastMessage.data),
			]);
			console.log("New message:", JSON.parse(lastMessage.data));
			console.log("Messages:", messages);
		}
	}, [lastMessage]);

	const handleMessage = (message) => {
		console.log("New message:", message);
		sendMessage(JSON.stringify({ ...message, type: "send" }));
		document.getElementById("default-notification").play();
	};

	const handleAccept = (index) => {
		return () => {
			console.log("Accepted", messages[index]);
			setMessages((prevMessages) => [
				...prevMessages.slice(0, index),
				...prevMessages.slice(index + 1),
			]);
			sendMessage(
				JSON.stringify({
					type: "accept",
					...messages[index],
				})
			);
			document.getElementById("default-notification").play();
		};
	};

	const handleReject = (index) => {
		return () => {
			console.log("Rejected", messages[index]);
			setMessages((prevMessages) => [
				...prevMessages.slice(0, index),
				...prevMessages.slice(index + 1),
			]);
			sendMessage(
				JSON.stringify({
					type: "reject",
					...messages[index],
				})
			);
		};
	};

	return (
		<div className="host">
			<audio src={notificationUrl} id="default-notification"></audio>
			<audio src={spamAudioUrl} id="spam-notification"></audio>

			<h1>Host</h1>
			{readyState !== ReadyState.OPEN && "WebSocket is not ready"}

			<div className="message-input">
				<MessageInput sendMessage={handleMessage} type="host" />
				<input
					type="button"
					value="Bildschirm leeren"
					onClick={() => sendMessage(JSON.stringify({ type: "clear" }))}
				/>
				<input
					type="button"
					value="Nachrichten Alarm"
					onClick={() => {
						document.getElementById("spam-notification").play();
					}}
				/>
			</div>
			<div className="proposal-container">
				{messages.map((message, index) => (
					<MessageProposal
						key={index}
						message={message}
						onAccept={handleAccept(index)}
						onReject={handleReject(index)}
					/>
				))}
			</div>
		</div>
	);
}
