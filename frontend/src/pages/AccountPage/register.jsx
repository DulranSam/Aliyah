/* eslint-disable react/no-unknown-property */
import Axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../main.css";
import "./account.css";
import { UserContext } from "../../App.jsx";
import { Helmet } from "react-helmet";

const Register = () => {
  const navigator = useNavigate();
  const { loading, setLoading, user, setUser, BASE } = useContext(UserContext);
  const [status, setStatus] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/register`, user);

      if (response.status === 201) {
        setStatus("You are registered!");
        setTimeout(() => {
          navigator("/login");
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setStatus(`${user.username} Already Taken!`);
      } else if (err.response && err.response.status === 400) {
        setStatus(`${user.username} Already Taken!`);
      } else {
        setStatus(
          `An error occurred while registering. Please try again later. ${err.response.status}`
        );
      }
      console.error(err);
    } finally {
      setLoading(false);
      setUser({ username: "", password: "" });
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>ALiyah | Register</title>
      </Helmet>
      <div className="backgroundContainer">
        <img
          alt="background"
          className="bgImg2"
          src="./images/background2.png"
        />
        <div className="a-container">
          <img alt="avatar" className="avItem2" src="./images/avatar.png" />
          <br />
          <p className="containerTitle">Register</p>
          <p className="containerText">
            Already have an account?&nbsp;
            <a href="login" style={{ color: "black" }}>
              Login
            </a>
          </p>
          <p>{status}</p>
          <form onSubmit={handleRegister} className="forms">
            <div className="inputLabelGrp">
              <label
                styles={{ fontSize: "18px", color: "#666666" }}
                htmlFor="username"
              >
                Your username
              </label>
              <input
                className="inputBox"
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                placeholder="Enter your username here..."
                required
              />
            </div>
            <div className="inputLabelGrp">
              <label
                styles={{ fontSize: "18px", color: "#666666" }}
                htmlFor="password"
              >
                Your password
              </label>
              <input
                className="inputBox"
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password here..."
                required
              />
            </div>
            <button type="submit" className="button" disabled={loading}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
