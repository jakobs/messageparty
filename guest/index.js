const wsURL = `ws://${location.host}/guest`;
const ws = new WebSocket(wsURL);

document.getElementById("send").onclick = () => {
	const message = document.getElementById("message").value;
	const author = document.getElementById("author").value;

	if (!message) {
		return;
	}

	const data = JSON.stringify({
		msg: message,
		author: author,
	});

	//empty the input
	document.getElementById("message").value = "";
	document.getElementById("author").value = "";

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
