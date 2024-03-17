export default function MessageProposal({ message, onAccept, onReject }) {
	return (
		<div className="proposal">
			<div className="author">{message.author}</div>
			<div className="content">{message.content}</div>
			<div className="select">
				<input type="button" value="Entfernen" onClick={onReject} />
				<input type="button" value="Anzeigen" onClick={onAccept} />
			</div>
		</div>
	);
}
