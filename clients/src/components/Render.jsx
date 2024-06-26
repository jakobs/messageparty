import MessageBubble from "./MessageBubble";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function Render() {
	const [message, setMessage] = useState();

	// depending if the connection uses ssl, the url will be different
	const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
	const { sendMessage, lastMessage, readyState } = useWebSocket(
		`${wsProtocol}://${window.location.host}/ws/render`,
		{
			share: false,
			shouldReconnect: () => true,
		}
	);

	useEffect(() => {
		if (lastMessage !== null) {
			const msg = JSON.parse(lastMessage.data);
			if (msg.type === "clear") {
				setMessage(null);
			} else {
				setMessage(msg);
			}
		}
	}, [lastMessage]);

	return (
		<div className="message-render">
			{message && <MessageBubble message={message} />}
			{readyState !== 1 && "WebSocket is not ready"}
		</div>
	);
}
