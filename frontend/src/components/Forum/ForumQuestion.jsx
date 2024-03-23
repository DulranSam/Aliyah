/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useContext, useEffect } from "react";
import { useState } from "react";

import Axios from "axios";

import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { UserContext } from "../../App";

const ForumQuestion = (questionDataParam, theKey) => {
  let questionData = questionDataParam.questionData;
  const { BASE, status, setStatus, user } = useContext(UserContext);

  const [answer, setAnswer] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  useEffect(() => {
    console.log(`The question data -> ${JSON.stringify(questionData)}`);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 2500);
  }, [status]);

  const increaseVotes = async (id) => {
    try {
      setLoading(true);
      const response = await Axios.put(`${BASE}/forum/upvotes/${id}`, {
        userId: loggedInUser._id,
      });
      // if (response.status === 200) {

      // } else {
      //   setStatus("Error while upvoting");
      // }

      if (response.status === 200) {
        console.log("Yess!");
      }

      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, rating: item.rating + 1 } : item
        )
      );
      setTimeout(() => {
        navigator("/forum");
      }, 2000);
    } catch (error) {
      if (error.status === 400) {
        setStatus("Error!");
      }
      console.error("Error while upvoting:", error);
    } finally {
      setLoading(false);
    }
  };

  const nerdPointsIncrement = async (id) => {
    try {
      const response = await Axios.put(`${BASE}/forum/nerds/${id}`, {
        userID: loggedInUser._id,
      });
      if (response.status === 200) {
        setStatus("Nerd points updated!");
        console.log(response.data);
      } else {
        setStatus("Error while updating!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downVote = async (id) => {
    try {
      setLoading(true);
      const response = await Axios.put(`${BASE}/forum/downvotes/${id}`, {
        userId: user.id,
      });
      if (response.status === 200) {
        setStatus("Down Voted");
        setData((prev) =>
          prev.map((x) => (x._id === id ? { rating: x.rating - 1 } : x))
        );
      } else {
        setStatus("Error while downvoting");
      }
      setTimeout(() => {
        navigator("/forum");
      }, 2000);
    } catch (error) {
      console.error("Error while downvoting:", error);
    } finally {
      setLoading(false);
    }
  };

  const AnsweringQuestions = async (id, answer) => {
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/forum/addAnswerToQuestion`, {
        questionId: id,
        answer: answer,
        answeredBy: loggedInUser.username,
      });
      if (response.status === 200) {
        console.log("Answer posted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error posting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteComment = async (id) => {
    try {
      const response = await Axios.delete(`${BASE}/forum/${id}`);
      if (response.status === 200) {
        setData((prev) => prev.filter((comment) => comment._id !== id));
        forumData();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setStatus("Question Not found!");
      }
      console.error("Error deleting comment:", error);
    }
  };

  const DeleteAnswer = async (id, by) => {
    console.log(`The userID is ${loggedInUser._id}`);
    console.log(by);
    try {
      const response = await Axios.delete(`${BASE}/forum/delans/${id}`, {
        whoAnswered: by,
      });
      if (response.status === 200) {
        setData((prev) => prev.filter((comment) => comment._id !== id));
        forumData(); // Assuming this function refreshes the forum data after deleting the comment
      }
    } catch (error) {
      if (error.status === 404) {
        setStatus("Comment Not found!");
      } else if (error.status === 400) {
        setStatus("No ID/Who Answered Provided!");
      }
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div key={theKey} className="card" style={{ marginBottom: "20px" }}>
      <Typography variant="h4">{status}</Typography>
      <Typography variant="h4">{questionData.question}</Typography>
      <Typography variant="body1">{questionData.description}</Typography>
      {questionData.answers.length > 0 ? (
        questionData.answers.map((answer, index) => (
          <div key={index} style={{ margin: "20px" }}>
            <br />
            <Typography variant="h6">{answer.text}</Typography>
            <Typography variant="body1">
              {answer.answeredBy
                ? ` By ${answer.answeredBy}`
                : "No answers yet!"}
            </Typography>
            <Typography variant="body1">
              {answer.noOfUpvotes
                ? ` Number of votes: ${answer.noOfUpvotes}`
                : "No upvotes!"}
            </Typography>
            <br />
            {answer.answeredBy === loggedInUser.username ? (
              <Button
                onClick={() => DeleteAnswer(answer._id, answer.answeredBy)}
              >
                Delete
              </Button>
            ) : (
              ""
            )}
            <br />
            <Button
              onClick={() => nerdPointsIncrement(questionData._id)}
              variant="contained"
              color="primary"
            >
              Give Points!
            </Button>
          </div>
        ))
      ) : (
        <Typography variant="h6">Be the first to Answer 🥳</Typography>
      )}
      <Typography variant="body2">
        {questionData.by ? `Posted by ${questionData.by}` : ""}
      </Typography>
      <Typography variant="body2">
        {questionData.rating
          ? `Upvoted by ${questionData.rating}`
          : "Rated by none"}
      </Typography>
      <Button onClick={() => increaseVotes(questionData._id)}>Upvote</Button>
      <Button onClick={() => downVote(questionData._id)}>DownVote</Button>
      <Button onClick={() => DeleteComment(questionData._id)}>Delete</Button>
      <Button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {toggle ? "Close" : "Answer"}
      </Button>
      {toggle ? (
        <form
          className="replyForm"
          onSubmit={(e) => {
            e.preventDefault();
            AnsweringQuestions(questionData._id, answer);
          }}
        >
          <Input
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer..."
            type="text"
          />
          <Button type="submit">Answer</Button>
        </form>
      ) : (
        ""
      )}
    </div>
  );
};

export default ForumQuestion;
