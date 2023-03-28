import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import reducer from "../Reducers";

const store = configureStore({ reducer: reducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk) });
export default store