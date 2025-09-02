import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const config = (window as any).DESKER_CHATBOT_CONFIG;
const container = document.getElementById("desker-chatbot-widget-container");

if (config && container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>
  );
  delete (window as any).DESKER_CHATBOT_CONFIG;
}
