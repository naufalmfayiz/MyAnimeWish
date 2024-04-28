import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import sweetAlert from "../utils/sweetAlert";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChangeInput = (event) => {
    const { type, value } = event.target;
    setInput({ ...input, [type]: value });
  };

  const submitSignUp = async (event) => {
    event.preventDefault();

    try {
      let { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_API_BASE_URL + "/add-user",
        data: input,
      });
      console.log(data);
      Swal.fire({
        title: "Success!",
        text: "Account successfully registered",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.log(error);
      sweetAlert(error.response.data.message);
    }
  };

  return (
    <>
      <section className="container">
        <div className="col-12 col-lg-8 offset-lg-2 my-5 bg-white bg-opacity-25">
          <div className="row">
            <div className="col-12 col-md-6 p-4 text-left">
              <img
                src="https://wallpapers.com/images/hd/anime-collage-aesthetic-vkqhmlebiysyzkm8.jpg"
                width="350px"
                height="400px"
                alt="login pic"
              />
            </div>
            <div className="col-12 col-md-6 pt-5 px-5 text-center">
              <div className="form-signin m-auto">
                <form id="login-form" onSubmit={submitSignUp}>
                  <h4 className="mb-3">Register to MyAnimeWish</h4>
                  <div className="mb-3 mt-5">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="login-email">Email</label>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="login-email"
                      placeholder="Enter your email..."
                      autoComplete="off"
                      required=""
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="login-password">Password</label>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="login-password"
                      placeholder="Enter your password..."
                      autoComplete="off"
                      required=""
                      onChange={handleChangeInput}
                    />
                  </div>
                  <button
                    className="btn btn-lg btn-primary btn-sm rounded-pill w-50 p-2"
                    type="submit"
                  >
                    Register
                  </button>
                </form>
              </div>
              <p className="mt-3">
                Already have an account? <Link to="/login">login</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
