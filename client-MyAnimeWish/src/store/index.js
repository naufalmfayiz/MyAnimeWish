import { configureStore } from "@reduxjs/toolkit";
import animeSlice from "./animeSlice";

export default configureStore({
  reducer: animeSlice,
});
