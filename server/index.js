const express = require("express");
const expressWs = require("express-ws");
require("dotenv").config();

const app = express();
expressWs(app);

// Store connections for each client type
const guestClients = [];
let hostClient = null;
let renderClient = null;

// WebSocket endpoint for guest clients
app.ws("/guest", (ws, req) => {
	// Add the guest client to the list
	guestClients.push(ws);

	ws.on("message", (message) => {
		// Forward guest messages to host client
		console.log("Message from guest client: " + message);
		if (hostClient) {
			hostClient.send(message);
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
app.ws("/host", (ws, req) => {
	// Set the host client and forward messages to render client
	hostClient = ws;

	ws.on("message", (message) => {
		// Forward host messages to render client
		console.log("Message from host client: " + message);
		if (renderClient) {
			renderClient.send(message);
		}
	});

	ws.on("close", () => {
		// Reset the host client when the connection is closed
		hostClient = null;
	});
});

// WebSocket endpoint for render client
app.ws("/render", (ws, req) => {
	console.log("Render client connected");
	// Set the render client
	renderClient = ws;

	ws.on("close", () => {
		// Reset the render client when the connection is closed
		renderClient = null;
	});
});

// Serve a simple HTML page for testing
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 4538;
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
