import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import Swal from "sweetalert2";
import { fetchWatchList } from "../store/animeSlice";

export default function WatchlistPage() {
  const watchList = useSelector((state) => {
    return state.watchList;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWatchList());
  }, []);

  async function handleDelete(id) {
    try {
      let { data } = await axios({
        method: "delete",
        url: import.meta.env.VITE_API_BASE_URL + `/anime/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      dispatch(fetchWatchList());
      // console.log(data);
      Swal.fire({
        title: "Success!",
        text: data.message,
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.log(error);
      const errMsg = error.response.data.message;
      Swal.fire({
        title: "Error!",
        text: errMsg,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  }

  return (
    <>
      <section className="col-md-9 col-lg-10 px-md-4 mx-auto" id="watchlist">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h2 className="">My Watchlist</h2>
        </div>
        <div className="row">
          <div className="col-12 table-responsive">
            {watchList.length === 0 ? (
              <div className="text-center h5 mt-3">There is no anime yet</div>
            ) : (
              <table className="table align-middle table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col" width="350px">
                      Title
                    </th>
                    <th scope="col">Score</th>
                    <th scope="col">Your Score</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {watchList.map((anime) => {
                    return (
                      <TableRow
                        anime={anime}
                        key={anime.id}
                        handleDelete={handleDelete}
                      />
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function TableRow({ anime, handleDelete }) {
  return (
    <>
      <tr>
        <td>
          <img src={anime.imageUrl} className="img-fluid" />
        </td>
        <td className="">
          <a
            className="link-light link-offset-2-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            href={anime.url}
            target="_blank"
          >
            {anime.title}
          </a>
        </td>
        <td className="text-center">{anime.score}</td>
        <td className="text-center">
          {anime.userScore === 0 ? "N/A" : anime.userScore}
        </td>
        <td className="">{anime.status}</td>
        <td>
          <span className="d-flex">
            <Link
              href=""
              className="ms-3 btn btn-outline-primary"
              to={`/update/${anime.id}`}
            >
              Edit
            </Link>
            <Link
              className="ms-3 btn btn-outline-danger"
              onClick={() => {
                handleDelete(anime.id);
              }}
            >
              Delete
            </Link>
          </span>
        </td>
      </tr>
    </>
  );
}
