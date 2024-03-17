const { log } = require("console");
const express = require("express");
const expressWs = require("express-ws");
require("dotenv").config();

const app = express();
expressWs(app);

app.use(express.static("../clients/dist"));
app.use("/host", express.static("../clients/dist"));
app.use("/render", express.static("../clients/dist"));

// Store connections for each client type
const guestClients = [];
let hostClient = null;
let renderClient = null;

const messages = {};
let messageIndex = 0;

// open a log file to write the messages into
const fs = require("fs");
const path = require("path");
const logFile = path.join(__dirname, "log.txt");
// open the file for writing
const logStream = fs.createWriteStream(logFile, { flags: "a" });

// WebSocket endpoint for guest clients
app.ws("/ws/guest", (ws, req) => {
	console.log("Guest client connected");
	// Add the guest client to the list
	guestClients.push(ws);

	ws.on("message", (message) => {
		const msg = {
			...JSON.parse(message),
			messageIndex,
		};
		messages[messageIndex] = msg;
		messageIndex++;

		console.log("Message from guest client: " + message);
		// write the message to the log file
		logStream.write(message + "\n");

		if (hostClient) {
			hostClient.send(JSON.stringify(msg));
		}
	});

	ws.on("close", () => {
		// Remove the guest client from the list when the connection is closed
		const index = guestClients.indexOf(ws);
		if (index !== -1) {
			guestClients.splice(index, 1);
		}
	});
});

// WebSocket endpoint for host client
app.ws("/ws/host", (ws, req) => {
	// Set the host client and forward messages to render client
	hostClient = ws;

	console.log("Host client connected");
	for (const message of Object.values(messages)) {
		ws.send(JSON.stringify(message));
	}

	ws.on("message", (message) => {
		const msg = JSON.parse(message);
		switch (msg.type) {
			case "accept":
				delete messages[msg.messageIndex];
				if (renderClient) {
					renderClient.send(JSON.stringify(msg));
				}
				break;
			case "reject":
				delete messages[msg.messageIndex];
				break;
			case "send":
				if (renderClient) {
					renderClient.send(JSON.stringify(msg));
				}
				break;
			case "clear":
				if (renderClient) {
					renderClient.send(JSON.stringify(msg));
				}
				break;
		}

		console.log("Message from host client: " + message);
	});

	ws.on("close", () => {
		// Reset the host client when the connection is closed
		hostClient = null;
	});
});

// WebSocket endpoint for render client
app.ws("/ws/render", (ws, req) => {
	console.log("Render client connected");
	// Set the render client
	renderClient = ws;

	ws.on("close", () => {
		// Reset the render client when the connection is closed
		renderClient = null;
	});
});

const PORT = process.env.PORT || 4538;
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
