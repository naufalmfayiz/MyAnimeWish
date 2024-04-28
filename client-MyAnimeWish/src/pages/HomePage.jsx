import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AnimeCard from "../components/AnimeCard";
import { fetchAnimes, fetchSuccess } from "../store/animeSlice";

export default function HomePage() {
  const animes = useSelector((state) => {
    return state.animes;
  });
  const dispatch = useDispatch();
  // console.log(animes);

  useEffect(() => {
    dispatch(fetchAnimes());
  }, []);

  return (
    <>
      <div className="container-fluid">
        <h2 className="mt-4 mb-2 ms-2">TOP 25 ANIME</h2>

        <div className="d-flex row mx-3">
          {animes.map((anime) => {
            return <AnimeCard anime={anime} key={anime.mal_id} />;
          })}
        </div>
      </div>
    </>
  );
}
