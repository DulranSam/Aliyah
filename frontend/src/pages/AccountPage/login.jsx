/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import Axios from "axios";
import { UserContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../main.css";
import "./account.css";

const Login = () => {
  const navigator = useNavigate();
  const {
    user,
    loading,
    setLoading,
    setIsAuthenticated,
    IsAuthenticated,
    setUser,
    setData,
    data,
    userId,
    BASE,
    setUserId,
  } = useContext(UserContext); //there's a problem here (context)
  const [issue, setIssue] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  async function Login(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/login`, user);
      
      localStorage.setItem("id", response.data.data._id);
      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
        setIsAuthenticated(true);
        setUserId(response.data.data._id);

        sessionStorage.setItem("loggedUser", JSON.stringify(response.data));
        navigator("/");
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        console.log(user);
        setIssue("Wrong Password, Please try again!");
      } else if (error.response.status === 404) {
        setIssue("Invalid Username, Please Try Again!");
      }
    } finally {
      setLoading(false);
    }
  }

  return IsAuthenticated ? (
    <div className="backgroundContainer">
      <div className="a-container">
        <img alt="avatar" className="avItem2" src="./images/avatar.png" />
        <h1 style={{ textAlign: "center" }}>
          Hi {data.username} your logged in!
        </h1>
      </div>
    </div>
  ) : (
    <>
      <Helmet>
        <title>ALiyah | Login</title>
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
          <p className="containerTitle">Login</p>
          <p className="containerText">
            Dont have an account?&nbsp;
            <Link to="/registration" style={{ color: "black" }}>
              Register
            </Link>
          </p>
          <p style={{margin:"15px"}}>{issue}</p>
          <form onSubmit={Login} className="forms">
            <div className="inputLabelGrp">
              <label
                styles={{ fontSize: "18px", color: "#666666" }}
                htmlFor="username"
              >
                Your username
              </label>
              <input
                className="inputBox"
                onChange={handleChange}
                type="text"
                id="username"
                name="username" //added name here cuz the we're targeting target value by referring to the name
                placeholder="Enter your username here..."
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
                onChange={handleChange}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password here..."
              />
            </div>
            <button type="submit" className="button" disabled={loading}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
