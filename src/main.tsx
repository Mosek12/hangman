import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.scss";
import "./styles/app.scss";
import "reactjs-popup/dist/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
