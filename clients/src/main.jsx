import React from "react";
import ReactDOM from "react-dom/client";
import Guest from "./components/Guest";
import Host from "./components/Host";
import Render from "./components/Render";
import "./styles/index.scss";
import "./styles/message-base.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Guest />,
	},
	{
		path: "/host",
		element: <Host />,
	},
	{
		path: "/render",
		element: <Render />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
