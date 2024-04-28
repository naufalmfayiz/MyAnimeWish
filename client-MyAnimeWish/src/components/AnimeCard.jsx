import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import sweetAlert from "../utils/sweetAlert";

export default function AnimeCard({ anime }) {
  const navigate = useNavigate();

  const handleAddWatch = async (url, imageUrl, title, score) => {
    try {
      // console.log(url, imageUrl, title, score);
      const { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_API_BASE_URL + "/anime",
        data: {
          url,
          imageUrl,
          title,
          score,
        },
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Anime added to your watchlist",
        icon: "success",
        confirmButtonText: "Ok",
      });
      navigate("/watchlist");
      // console.log(data);
    } catch (error) {
      console.log(error);
      sweetAlert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="col-6 col-md-3 col-lg-2 mb-3">
        <div className="card p-0" style={{ width: "auto", height: "auto" }}>
          <a className="link" href={anime.url} target="_blank">
            <img
              src={anime.images.jpg.image_url}
              className="card-img-top"
              alt="anime poster"
            />
          </a>
          <div className="card-body text-center">
            <h6 className="card-title">{anime.title}</h6>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleAddWatch(
                  anime.url,
                  anime.images.jpg.small_image_url,
                  anime.title,
                  anime.score
                );
              }}
            >
              Add to watchlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
