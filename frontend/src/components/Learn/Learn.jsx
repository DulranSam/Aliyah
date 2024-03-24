/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { FetchMaterial } from "../Api/Api";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import NotLogged from "../NotLogged";
import { ProgressBar } from "react-loader-spinner";
import "./Learn.css";
import Axios from "axios";
import NavBar from "../NavigationBar/navBar";
import s1img from "./s1-img.png";
import p1img from "./p1-img.png";

const Learn = () => {
  const {
    loggedInUser,
    setLoggedInUser,
    loading,
    logged,
    BASE,
    theTopic,
    setTheTopic,
    setLoading,
  } = useContext(UserContext);

  const [startedModule, setStartedModule] = useState([]);

  const fetchStartedModule = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/resources/getStartedCourses`, {
        userId: loggedInUser._id,
      });
      setStartedModule(response.data.startedCourses);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(sessionStorage.getItem("loggedUser"));
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  useEffect(() => {
    if (Object.keys(loggedInUser).length > 0) {
      fetchStartedModule();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (startedModule.length > 0) {
      console.log(startedModule);
    }
  }, [startedModule]);

  return (
    Object.keys(loggedInUser).length > 0 &&
    (loading ? (
      <h1 className="learn-container" style={{ padding: "60px" }}>
        Loading...
      </h1>
    ) : (
      <>
        <NavBar />
        <div className="learn-container">
          <header className="header">
            <h1 className="lr-heading">Learning Resources</h1>
          </header>
          <div className="subjects-container">
            {startedModule.length > 0 ? (
              startedModule.map((course, index) => (
                <div className="sc-container" key={course._id}>
                  <h3>{course}</h3>
                  <div className="subject-card" key={index}>
                    {course === "Probability and Statistics I" && (
                      <img className="subject-img" src={s1img}></img>
                    )}
                    {course === "Pure Mathematics I" && <img src={p1img}></img>}
                    <Link
                      to={
                        course === "Pure Mathematics I"
                          ? `/learnprint/p1`
                          : course === "Probability and Statistics I"
                          ? `/learnprint/s1`
                          : null
                      }
                      key={index}
                      className="subject-link"
                    >
                      <button className="sc-btn">Start</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <Typography
                variant="h5"
                style={{ padding: "40px", fontWeight: "bold" }}
              >
                No Courses Started Yet! 🤷‍♂️
              </Typography>
            )}
          </div>
        </div>
      </>
    ))
  );
};

export default Learn;
