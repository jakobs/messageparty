const wsURL = `ws://${location.host}/render`;
const ws = new WebSocket(wsURL);

let currentMessage = null;

function createNewMessage(messageText, authorName) {
	if (currentMessage !== null) {
		currentMessage.remove();
		currentMessage = null;
	}

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
	currentMessage = newMessage;
}

ws.onmessage = (event) => {
	console.log(event.data);
	const data = JSON.parse(event.data);
	if (data.type === "message") {
		createNewMessage(data.msg, data.author);
	} else if (data.type === "clear") {
		if (currentMessage === null) return;
		currentMessage.remove();
		currentMessage = null;
	}
};

setInterval(() => {
	//check if the websocket is closed
	if (ws.readyState === WebSocket.CLOSED) {
		//try to reconnect
		ws = new WebSocket(wsURL);
	}
}, 1000);
