const wsURL = `ws://${location.host}/host`;
const ws = new WebSocket(wsURL);

document.getElementById("send").onclick = () => {
	const message = document.getElementById("message").value;
	const author = document.getElementById("author").value;

	if (!message || !author) {
		return;
	}

	const data = JSON.stringify({
		type: "message",
		msg: message,
		author: author,
	});

	//empty the input
	document.getElementById("message").value = "";
	document.getElementById("author").value = "";

	console.log(data);
	ws.send(data);
};

ws.onmessage = (event) => {
	console.log(event.data);
	const data = JSON.parse(event.data);
	addProposedMessage(data.msg, data.author);
};

function addProposedMessage(message, author) {
	const container = document.getElementById("proposed-messages");

	const messageCon = document.createElement("div");
	messageCon.className = "message";
	container.appendChild(messageCon);

	const authorEl = document.createElement("div");
	authorEl.innerText = author;
	authorEl.className = "message-author";
	messageCon.appendChild(authorEl);

	const messageEl = document.createElement("div");
	messageEl.innerText = message;
	messageEl.className = "message-content";
	messageCon.appendChild(messageEl);

	const button = document.createElement("button");
	button.innerText = "Accept";
	button.onclick = () => {
		messageCon.remove();

		const data = JSON.stringify({
			type: "message",
			msg: messageEl.innerText,
			author: authorEl.innerText,
		});

		console.log(data);
		ws.send(data);
	};

	//add a remove button
	const removeButton = document.createElement("button");
	removeButton.innerText = "Remove";
	removeButton.onclick = () => {
		messageCon.remove();
	};
	messageCon.appendChild(removeButton);

	messageCon.appendChild(button);
}

document.getElementById("clear").onclick = () => {
	const data = JSON.stringify({
		type: "clear",
	});

	console.log(data);
	ws.send(data);
};

setInterval(() => {
	//check if the websocket is closed
	if (ws.readyState === WebSocket.CLOSED) {
		//try to reconnect
		ws = new WebSocket(wsURL);
	}
}, 1000);
