import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter  } from 'react-router-dom';
import { ScrollToTop } from 'react-router-scroll-to-top';
import { Provider } from 'react-redux';
import pkg from 'semantic-ui-react/package.json'

import store from './Redux/Store'
import { userContext } from './contextObject/global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

const styleLink = document.createElement("link");
const dateLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
dateLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui-calendar-react@latest/dist/umd/semantic-ui-calendar-react.js";
document.head.appendChild(dateLink);
document.head.appendChild(styleLink);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ScrollToTop />
//       <Provider store={store}>
//         <App />
//         <ToastContainer />
//       </Provider>
//     </BrowserRouter>
//   </React.StrictMode>
// );



// import React from "react";
// import ReactDOM from "react-dom";

// import App from "./App";
// import { Provider } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";

// import store from "./Redux/Store";

// import { BrowserRouter } from "react-router-dom";
// import { ScrollToTop } from "react-router-scroll-to-top";

// import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);