import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = createRoot(document.getElementById("root"));

root.render(
	<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CID}>
		<Router>
			<App />
		</Router>
	</GoogleOAuthProvider>
);
