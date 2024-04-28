import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import sweetAlert from "../utils/sweetAlert";

export default function UpdatePage() {
  const [input, setInput] = useState({
    userScore: "",
    status: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  //>>>> PUT
  useEffect(() => {
    if (id) {
      async function fetchAnimeById() {
        try {
          let { data } = await axios({
            method: "GET",
            url: import.meta.env.VITE_API_BASE_URL + `/anime/${id}`,
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`,
            },
          });
          // console.log(data);
          let { userScore, status } = data;
          setInput({ userScore, status });
        } catch (error) {
          console.log(error);
          sweetAlert(error.response.data.message);
        }
      }
      fetchAnimeById();
    }
  }, []);

  const handleForm = async (event) => {
    event.preventDefault();
    // console.log(input);
    try {
      let data = await axios({
        method: "PUT",
        url: import.meta.env.VITE_API_BASE_URL + "/anime/" + id,
        data: input,
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      // console.log(data);
      navigate("/watchlist");
      Swal.fire({
        title: "Success!",
        text: "Anime score/status successfully updated",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.log(error);
      sweetAlert(error.response.data.message);
    }
  };

  return (
    <>
      <section className="mx-auto col-8 col-md-12 col-lg-9 px-md-4 mt-5">
        <div className="row mt-3">
          <div className="mx-auto col-12 col-md-6 bg-light bg-opacity-25">
            <form onSubmit={handleForm}>
              <h3 className="my-3 text-center">
                Give this anime score and set your status
              </h3>
              <div className="mb-3">
                <label>Score</label>
                <select
                  className="form-select"
                  required=""
                  name="userScore"
                  value={input.userScore}
                  onChange={handleChangeInput}
                >
                  <option value={0} disabled>
                    -- Select Score --
                  </option>
                  <option value={10}>10 (Masterpiece)</option>
                  <option value={9}>9 (Great)</option>
                  <option value={8}>8 (Very Good)</option>
                  <option value={7}>7 (Good)</option>
                  <option value={6}>6 (Fine)</option>
                  <option value={5}>5 (Average)</option>
                  <option value={4}>4 (Bad)</option>
                  <option value={3}>3 (Very Bad)</option>
                  <option value={2}>2 (Horrible)</option>
                  <option value={1}>1 (Worst)</option>
                </select>
              </div>
              <div className="mb-3">
                <label>Status</label>
                <select
                  id="product-category"
                  className="form-select"
                  required=""
                  name="status"
                  value={input.status}
                  onChange={handleChangeInput}
                >
                  <option value="" disabled>
                    -- Select Status --
                  </option>
                  <option value="Plan to Watch">Plan to Watch</option>
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="On-Hold">On-Hold</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
              <div className="row mt-5 mb-3">
                <div className="col-6">
                  <Link
                    className="btn btn-lg btn-danger rounded-pill w-100 p-2"
                    to="/watchlist"
                  >
                    Cancel
                  </Link>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-lg btn-primary rounded-pill w-100 p-2"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
