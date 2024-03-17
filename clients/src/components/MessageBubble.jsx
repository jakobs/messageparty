import "../styles/message-bubble.scss";

export default function MessageBubble({ message }) {
	return (
		<div className="message-bubble">
			<div className="speech"></div>
			<div className="main">
				<div className="author">{message.author}</div>
				<div className="content">{message.content}</div>
			</div>
		</div>
	);
}
