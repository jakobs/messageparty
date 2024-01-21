const PORT = 4538;
const wsURL = `ws://localhost:${PORT}/render`;
const ws = new WebSocket(wsURL);

function createNewMessage(messageText, authorName) {
	const container = document.getElementById("container");
	const newMessage = document.createElement("div");
	newMessage.classList.add("message-container");

	//add the author
	const author = document.createElement("div");
	author.classList.add("author");
	author.innerText = authorName;
	newMessage.appendChild(author);

	//add the message
	const message = document.createElement("div");
	message.classList.add("message");
	message.innerText = messageText;
	newMessage.appendChild(message);

	container.appendChild(newMessage);

	setTimeout(() => {
		newMessage.remove();
	}, 10000);
}

ws.onmessage = (event) => {
	console.log(event.data);
	const data = JSON.parse(event.data);
	createNewMessage(data.msg, data.author);
};

setInterval(() => {
	//check if the websocket is closed
	if (ws.readyState === WebSocket.CLOSED) {
		//try to reconnect
		ws = new WebSocket(wsURL);
	}
}, 1000);
