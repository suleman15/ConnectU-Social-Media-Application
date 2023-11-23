import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../features/reducer";

const store = configureStore({
  reducer: rootReducer,
});

const { dispatch } = store;

export { store, dispatch };
