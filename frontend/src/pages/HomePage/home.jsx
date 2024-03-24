/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import NavBar from "../../components/NavigationBar/navBar.jsx";
import "./home.css";
import "../main.css";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App.jsx";
import { Helmet } from "react-helmet";

function Home() {
  const { isAuthenticated, user, setIsAuthenticated, setUser } =
    useContext(UserContext);

  useEffect(() => {
    if (sessionStorage.getItem("loggedUser")) {
      setIsAuthenticated(true);
      setUser(JSON.parse(sessionStorage.getItem("loggedUser")));
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <>
      <Helmet>
        <title>ALiyah | Home</title>
      </Helmet>
      <NavBar />
      <div className="backgroundContainer">
        <img alt="background" className="bgImg" src="./images/background.png" />
        <div className="itemsContainer">
          <p style={{ fontSize: "64px", color: "white" }}>
            <b
              style={{
                fontSize: "128px",
                textShadow: "1px 1px 8px rgba(0, 0, 0, 1)",
              }}
            >
              ALiyah
            </b>
            <br />
            Welcome back, <i>{user.username}</i>
          </p>
          <p></p>
        </div>
      </div>
    </>
  ) : (
    <div>
      <Helmet>
        <title>Welcome to the realms of ALiyah!</title>
      </Helmet>
      <div className="backgroundContainer">
        <img alt="background" className="bgImg" src="./images/background.png" />
        <div className="itemsContainer">
          <p style={{ fontSize: "64px", color: "white" }}>
            <b style={{ fontSize: "128px" }}>ALiyah</b>
            <br />
            Your partner for learning
            <br />
            Advanced Level Mathematics!
          </p>
          <p style={{ color: "white", padding: "20px", fontStyle: "italic" }}>
            Welcome to the e-learning party! No velvet ropes, <br />
            just logins and laughter. Get on the guest list by registering or
            logging in!
          </p>
          <div className="registrationBtns">
            <Link to="login" className="clickLogBtn">
              Click here to Login!
            </Link>
            <Link to="registration" className="clickLogBtn">
              Click here to Register!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
