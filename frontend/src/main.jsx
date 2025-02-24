import React from "react";
import ReactDOM from "react-dom"; // ✅ React 17 uses ReactDOM.render()
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import Store from "./redux/store";

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("root") // ✅ Correct method for React 17
);
