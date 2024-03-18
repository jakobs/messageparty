import MessageInput from "./MessageInput";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Guest() {
	const { sendMessage, lastMessage, readyState } = useWebSocket(
		`wss://${window.location.host}/ws/guest`,
		{
			share: false,
			shouldReconnect: () => true,
		}
	);

	const handleMessage = (message) => {
		console.log("New message:", message);
		sendMessage(JSON.stringify(message));
	};

	return (
		<div className="guest">
			<h1>Smart</h1>
			{readyState !== ReadyState.OPEN && "WebSocket is not ready"}
			<div className="message-input">
				<MessageInput sendMessage={handleMessage} type="guest" />
			</div>
		</div>
	);
}
