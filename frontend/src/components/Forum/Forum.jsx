/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Axios from "axios";
import "./Forum.css";
import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { ClipLoader } from "react-spinners";

import ForumQuestion from "./ForumQuestion";
import NavBar from "../NavigationBar/navBar";

const Forum = () => {
  const {
    loading,
    setLoading,
    status,
    setStatus,
    BASE,
    logged,
    user,
    loggedInUser,
    setLoggedInUser,
    searched,
    setSearched,
    transfer,
    setTransfer,
    search,
    setSearch,
    upvoting,
  } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState("");
  const [down, setDown] = useState(0);
  const navigator = useNavigate();

  const [toggle, setToggle] = useState(false);
  const [theTotalUpvotes, setTheTotalUpvotes] = useState(0);
  const EndPoint = `${BASE}/forum`;

  useEffect(() => {
    let searchParams = "";

    if (down === 1) {
      searchParams = "Pure Mathematics I";
    } else if (down === 2) {
      searchParams = "Probability And Statistics I";
    }

    forumData(searchParams);
  }, [down]); // Added "down" to dependency array to trigger a re-fetch when topic selection changes

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  const forumData = async (searchParams) => {
    try {
      setLoading(true);

      const response = await Axios.post(EndPoint, {
        searchParams, // Include searchParams in the request body
      });

      setData(response.data);
    } catch (error) {
      setStatus("Error fetching forum data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(loggedInUser).length > 0) {
      forumData();
    }
  }, [loggedInUser]);

  const searchUp = async (e) => {
    e.preventDefault();
    try {
      const theData = await Axios.post(`${EndPoint}/search`, { search });
      // if (theData.data.status === 200) {

      // }
      setSearched(theData.data);
      setTransfer(1);
      navigator("/forum/search");
    } catch (err) {
      if (err.response.status === 404) {
        setStatus("No results found");
      }
      console.error(err);
    }
  };

  return loggedInUser ? (
    <>
      <NavBar />
      <hr />
      <Helmet>
        <title>ALiyah | Forum</title>
      </Helmet>
      <div className="mainContainer">
        <div className="forumContainer">
          <div className="fHeaderContainer">
            <div className="forumHeader">
              <p className="forumTitle" style={{marginBottom:"20px"}}>
                👋 Hey there, {user.username || "guest"}! Welcome to our Forums!
              </p>
              <p style={{ fontSize: "16px" }}>
                Would you kindly grace us with a question? The button below
                eagerly awaits your gentle touch, yearning for the opportunity
                to fulfill its purpose in this vast digital realm.
              </p>
              <div style={{ marginTop: "10px" }}>
                <Link className="addQuestionBtn" to="/forum/add-question">
                  Add question
                </Link>
              </div>
            </div>
          </div>

          <div className="searchContainer">
            <p className="forumTitle">🔎 Search Filter</p>
            <br />
            <form onSubmit={searchUp} style={{ padding: "20px",margin:"40px" }}>
              <input
                className="searchQuestion"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search your queries here..."
                type="text"
              />
              <button className="searchBtn" type="submit" disabled={loading}>
                Search...
              </button>
            </form>
            <div style={{ display: "flex", marginTop: "4px" }}>
              <p style={{ fontSize: "18px", marginTop: "4px" }}>
                Filter : 
              </p>
              <form style={{ marginLeft: "10px" }}>
                <select
                  className="dropdownContainer"
                  value={down}
                  onChange={(e) => setDown(Number(e.target.value))}
                >
                  <option value={0}>All Questions</option>
                  <option value={1}>Pure Math</option>
                  <option value={2}>Statistics</option>
                </select>
              </form>
            </div>
          </div>
          <hr />
          <p>{status}</p>
          {loading ? (
            <div className="forumLoad">
              <ClipLoader size={80} color="#1fa3d5" loading={true} />
            </div>
          ) : data.length > 0 ? (
            data.map((x, index) => (
              <div key={index}>
                <ForumQuestion questionData={x} theKey={index} />
              </div>
            ))
          ) : (
            <p>No questions available</p>
          )}
          <p>{status}</p>
        </div>
      </div>
    </>
  ) : (
    <div>
      <p>
        Please <Link to="/login">login</Link> to continue to the forum
      </p>
    </div>
  );
};

export default Forum;
