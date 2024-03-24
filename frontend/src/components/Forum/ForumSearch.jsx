/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { Card, Button } from "react-bootstrap"; // Import Bootstrap components
import { Link } from "react-router-dom";
import Axios from "axios";
import ForumQuestion from "./ForumQuestion";
import "./Forum.css";

const ForumSearch = () => {
  const {
    searched,
    transfer,
    setSearched,
    search,
    setTransfer,
    status,
    setStatus,
    setSearch,
    loading,
    setLoading,
    upvoting,
    user,
    data,
    setData,
    toggle,
    setToggle,
    BASE,
  } = useContext(UserContext);

  const EndPoint = `${BASE}/forum`;

  const searchUp = async (e) => {
    e.preventDefault();
    try {
      const theData = await Axios.post(`${EndPoint}/search`, { search });
      console.log(theData.data);
      setSearched([]);
      setSearched(theData.data);
    } catch (err) {
      if (err.response.status === 404) {
        setStatus("No results found");
      }
      console.error(err);
    }
  };

  return transfer === 1 ? (
    <div className="search-container">
      <div className="forumHeader">
        <p style={{ fontSize: "26px", fontWeight: "bold" }}>Forum Search</p>
        <div className="theLinks" style={{ margin: "10px", padding: "20px" }}>
          <Link to={"/forum"} className="backToForum">
            Back To Forum
          </Link>
        </div>
        <Link to={"/forum/add-question"} className="backToForum" style={{margin: "40px"}}>
          Add Question
        </Link>
        <form
          onSubmit={searchUp}
          style={{ margin: "40px" }}
          className="search-forum"
        >
          <input
            className="searchQuestion"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search here..."
            type="text"
          ></input>
          <button className="searchBtn" type="submit" disabled={loading}>
            Search...
          </button>
        </form>
      </div>

      {searched && searched.length ? (
        <div>
          {searched.map((x, index) => (
            <div key={x._id || index}>
              <ForumQuestion questionData={x} theKey={index} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No results found</p>
      )}
    </div>
  ) : (
    window.location.replace("/forum")
  );
};

export default ForumSearch;
