import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

ReactDOM.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
