import { createSlice } from "@reduxjs/toolkit";
import sweetAlert from "../utils/sweetAlert";
import axios from "axios";

export const animeSlice = createSlice({
  name: "anime",
  initialState: {
    value: 0,
    animes: [],
    watchList: [],
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    fetchSuccess: (state, action) => {
      state.animes = action.payload;
    },
    fetchWatchListSuccess: (state, action) => {
      state.watchList = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  fetchSuccess,
  fetchWatchListSuccess,
} = animeSlice.actions;

//Action Async

//Fetch Anime from 3rd Party API
export function fetchAnimes() {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: "https://api.jikan.moe/v4/top/anime",
      });
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.log(error);
      const errMsg = error.response.data.message;
      sweetAlert(errMsg);
    }
  };
}

//fetch Watchlist from Database
export function fetchWatchList() {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: import.meta.env.VITE_API_BASE_URL + "/anime",
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      // console.log(data);
      dispatch(fetchWatchListSuccess(data));
    } catch (error) {
      console.log(error);
      const errMsg = error.response.data.message;
      sweetAlert(errMsg);
    }
  };
}

export default animeSlice.reducer;
