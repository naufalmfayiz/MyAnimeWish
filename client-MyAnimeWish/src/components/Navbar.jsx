import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-primary bg-primary sticky-top">
        <div className="container-fluid">
          <div className="fs-5 me-3">MyAnimeWish</div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/watchlist">
                  Watchlist
                </Link>
              </li>
            </ul>
            <button
              className="pe-3 btn btn-primary"
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("email");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
