import { useEffect, useState } from "react";
import axios from "axios";
import sweetAlert from "../utils/sweetAlert";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const CLIENT_ID = "d02abb71146d13de29d0";

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const codeParam = urlParams.get("code");
  // console.log(codeParam);

  const handleChangeInput = (event) => {
    const { type, value } = event.target;
    setInput({ ...input, [type]: value });
  };

  //INPUT LOGIN
  const submitLogin = async (event) => {
    event.preventDefault();

    try {
      let { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_API_BASE_URL + "/login",
        data: input,
      });
      // console.log(data.access_token);
      localStorage.access_token = data.access_token;
      localStorage.email = data.email;
      navigate("/");
    } catch (error) {
      console.log(error);
      sweetAlert(error.response.data.message);
    }
  };

  //GOOGLE LOGIN
  async function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    try {
      const { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_API_BASE_URL + "/google-login",
        headers: {
          google_token: response.credential,
        },
      });
      // console.log(data);
      localStorage.access_token = data.access_token;
      localStorage.email = data.email;
      navigate("/");
    } catch (error) {
      console.log(error);
      sweetAlert(error.response.data.message);
    }
  }

  function loadGoogleButton() {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  //GITHUB LOGIN
  function loadGithubButton() {
    if (codeParam && localStorage.getItem("access_token") == null) {
      async function getAccessToken() {
        try {
          const { data } = await axios({
            method: "GET",
            url:
              import.meta.env.VITE_API_BASE_URL +
              "/github-login?code=" +
              codeParam,
          });
          // console.log(data);
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.email = data.email;
          }
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      }
      getAccessToken();
    }
  }

  useEffect(() => {
    loadGoogleButton();
    loadGithubButton();
  }, []);

  async function handleGithubLogin(event) {
    event.preventDefault();
    try {
      window.location.assign(
        "https://github.com/login/oauth/authorize?client_id=" +
          import.meta.env.VITE_GITHUB_CLIENT_ID
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section className="container">
        <div className="col-12 col-lg-8 offset-lg-2 my-5 bg-white bg-opacity-25">
          <div className="row">
            <div className="col-12 col-md-6 p-4 text-left">
              <img
                src="https://w0.peakpx.com/wallpaper/24/511/HD-wallpaper-anime-anime-anime-collage.jpg"
                width="350px"
                height="400px"
                alt="login pic"
              />
            </div>
            <div className="col-12 col-md-6 pt-4 px-5 text-center">
              <div className="form-signin m-auto">
                <form id="login-form" onSubmit={submitLogin}>
                  <h4 className="mb-3">Login to MyAnimeWish</h4>
                  <div className="mb-3 mt-3">
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
                    Log In
                  </button>
                </form>
              </div>
              <div className="mx-auto mt-3">
                <p>Or sign in with</p>
                <div id="buttonDiv"></div>
                <button
                  className="btn btn-dark mt-2 w-50"
                  onClick={handleGithubLogin}
                >
                  <img
                    className="me-1"
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    style={{ height: "20%", width: "20%" }}
                    alt=""
                  />
                  Github
                </button>
              </div>
              <p className="mt-3">
                Dont have account yet? <Link to="/register">register</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
