/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { UserContext } from "../../App";

const ForumQuestion = (questionDataParam, theKey) => {
  const [questionData, setQuestionData] = useState(
    questionDataParam.questionData
  );

  const { BASE, status, setStatus, user } = useContext(UserContext);

  const [answer, setAnswer] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  // useEffect(() => {
  //   console.log(`The question data -> ${JSON.stringify(questionData)}`);
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 2500);
  }, [status]);

  const increaseVotes = async (questionIDValue) => {
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/forum/upvotes`, {
        questionID: questionIDValue,
      });
      // if (response.status === 200) {

      // } else {
      //   setStatus("Error while upvoting");
      // }

      if (response.status === 200) {
        console.log("Yess!");
        const updatedData = {
          ...questionData,
          rating: questionData.rating + 1,
        };

        setQuestionData(updatedData);

        const downVoteBtn = document.getElementById(
          `questionDownvote_${questionIDValue}`
        );
        const upVoteBtn = document.getElementById(
          `questionUpvote_${questionIDValue}`
        );

        downVoteBtn.disabled = true;
        downVoteBtn.style.opacity = "0.5";
        upVoteBtn.disabled = true;
        upVoteBtn.style.opacity = "0.5";
        downVoteBtn.style.pointerEvents = "none";
        upVoteBtn.style.pointerEvents = "none";
      }
    } catch (error) {
      if (error.status === 400) {
        setStatus("Error!");
      }
      console.error("Error while upvoting:", error);
    } finally {
      setLoading(false);
    }
  };

  const downVote = async (questionIDValue) => {
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/forum/downvotes`, {
        questionID: questionIDValue,
      });

      if (response.status === 200) {
        console.log("Yess!");
        const updatedData = {
          ...questionData,
          rating: questionData.rating - 1,
        };

        setQuestionData(updatedData);

        const downVoteBtn = document.getElementById(
          `questionDownvote_${questionIDValue}`
        );
        const upVoteBtn = document.getElementById(
          `questionUpvote_${questionIDValue}`
        );

        downVoteBtn.disabled = true;
        downVoteBtn.style.opacity = "0.5";
        upVoteBtn.disabled = true;
        upVoteBtn.style.opacity = "0.5";
        downVoteBtn.style.pointerEvents = "none";
        upVoteBtn.style.pointerEvents = "none";
      }
    } catch (error) {
      if (error.status === 400) {
        setStatus("Error!");
      }
      console.error("Error while upvoting:", error);
    } finally {
      setLoading(false);
    }
  };

  const downvoteAnswer = async (questionIDValue, answerIDValue) => {
    try {
      const response = await Axios.post(`${BASE}/forum/downvoteAnswer`, {
        questionID: questionIDValue,
        answerID: answerIDValue,
      });
      if (response.status === 200) {
        const newAnswers = [...questionData.answers];
        for (let i = 0; i < newAnswers.length; i++) {
          if (newAnswers[i]._id === answerIDValue) {
            newAnswers[i].noOfUpvotes -= 1;
            setQuestionData({ ...questionData, answers: newAnswers });

            const downVoteBtn = document.getElementById(
              `answerDownvote_${questionIDValue}_${answerIDValue}`
            );
            const upVoteBtn = document.getElementById(
              `answerUpvote_${questionIDValue}_${answerIDValue}`
            );

            downVoteBtn.disabled = true;
            downVoteBtn.style.opacity = "0.5";
            upVoteBtn.disabled = true;
            upVoteBtn.style.opacity = "0.5";
            downVoteBtn.style.pointerEvents = "none";
            upVoteBtn.style.pointerEvents = "none";
            break;
          }
        }
      } else {
        setStatus("Error while updating!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nerdPointsIncrement = async (questionIDValue, answerIDValue) => {
    try {
      const response = await Axios.post(`${BASE}/forum/upvoteAnswer`, {
        questionID: questionIDValue,
        answerID: answerIDValue,
      });
      if (response.status === 200) {
        const newAnswers = [...questionData.answers];

        for (let i = 0; i < newAnswers.length; i++) {
          if (newAnswers[i]._id === answerIDValue) {
            newAnswers[i].noOfUpvotes += 1;
            setQuestionData({ ...questionData, answers: newAnswers });

            const downVoteBtn = document.getElementById(
              `answerDownvote_${questionIDValue}_${answerIDValue}`
            );
            const upVoteBtn = document.getElementById(
              `answerUpvote_${questionIDValue}_${answerIDValue}`
            );

            downVoteBtn.disabled = true;
            downVoteBtn.style.opacity = "0.5";
            upVoteBtn.disabled = true;
            upVoteBtn.style.opacity = "0.5";
            downVoteBtn.style.pointerEvents = "none";
            upVoteBtn.style.pointerEvents = "none";
            break;
          }
        }
      } else {
        setStatus("Error while updating!");
      }
    } catch (err) {
      console.error(err);
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
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setStatus("Question Not found!");
      }
      console.error("Error deleting comment:", error);
    }
  };

  const DeleteAnswer = async (answerIDValue, questionIDValue) => {
    try {
      const response = await Axios.post(`${BASE}/forum/delans`, {
        questionID: questionIDValue, // Assuming questionIdValue holds the actual question ID
        answerID: answerIDValue, // Assuming answerIdValue holds the actual answer ID
      });
      if (response.status === 200) {
        console.log("Answer deleted successfully!");
        const newAnswers = [...questionData.answers];
        for (let i = 0; i < newAnswers.length; i++) {
          if (newAnswers[i]._id === answerIDValue) {
            newAnswers.splice(i, 1);
            setQuestionData({ ...questionData, answers: newAnswers });
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
    }

    // try {
    //   const response = await Axios.delete(`${BASE}/forum/delans/${id}`, {
    //     whoAnswered: "blackpeople",
    //   });
    //   if (response.status === 200) {
    //     setData((prev) => prev.filter((comment) => comment._id !== id));
    //     forumData(); // Assuming this function refreshes the forum data after deleting the comment
    //   }
    // } catch (error) {
    //   if (error.status === 404) {
    //     setStatus("Comment Not found!");
    //   } else if (error.status === 400) {
    //     setStatus("No ID/Who Answered Provided!");
    //   }
    //   console.error("Error deleting comment:", error);
    // }
  };

  return (
    <div key={theKey} className="questionCard">
      <p>{status}</p>
      <p className="questionTitle">{questionData.question}</p>
      <p className="questionDescription">{questionData.description}</p>
      <p style={{ paddingTop: "10px", fontSize: "16px" }}>Replies</p>

      {questionData.answers.length > 0 ? (
        questionData.answers.map((answer, index) => (
          <div key={index} style={{ margin: "16px" }}>
            <div className="answerCard">
              <p style={{ fontSize: "20px", paddingBottom: "10px" }}>
                replied by <i>{answer.answeredBy}</i>
              </p>
              <hr />
              <p style={{ fontSize: "16px" }}>{answer.text}</p>
            </div>
            <br />
            <div className="replyOptions">
              {answer.answeredBy !== loggedInUser.username ? (
                <div>
                  <button
                    id={`answerUpvote_${questionData._id}_${answer._id}`}
                    className="postBtns"
                    onClick={() =>
                      nerdPointsIncrement(questionData._id, answer._id)
                    }
                  >
                    Upvote
                  </button>
                  <button
                    id={`answerDownvote_${questionData._id}_${answer._id}`}
                    className="postBtns"
                    onClick={() => downvoteAnswer(questionData._id, answer._id)}
                  >
                    Downvote
                  </button>
                </div>
              ) : (
                <button
                  className="postBtns"
                  onClick={() => DeleteAnswer(answer._id, questionData._id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p style={{ fontSize: "12px", margin: "8px" }}>
              {answer.noOfUpvotes
                ? `Number of votes: ${answer.noOfUpvotes}`
                : "No upvotes!"}
            </p>
          </div>
        ))
      ) : (
        <p style={{ margin: "10px" }}>Be the first one to answer!🥳</p>
      )}
      <hr />
      <br />
      {loggedInUser.username !== questionData.by ? (
        <div>
          <button
            id={`questionUpvote_${questionData._id}`}
            className="postBtns"
            onClick={() => increaseVotes(questionData._id)}
          >
            Upvote
          </button>
          <button
            id={`questionDownvote_${questionData._id}`}
            className="postBtns"
            onClick={() => downVote(questionData._id)}
          >
            Downvote
          </button>
        </div>
      ) : (
        <button
          className="postBtns"
          onClick={() => DeleteComment(questionData._id)}
        >
          Delete
        </button>
      )}
      <button
        style={{marginTop: "10px"}}
        className="postBtns"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {" "}
        {toggle ? "Close" : "Answer"}
      </button>
      {toggle ? (
        <form
          className="replyForm"
          onSubmit={(e) => {
            e.preventDefault();
            AnsweringQuestions(questionData._id, answer);
          }}
        >
          <input
            className="replyInput"
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer..."
            type="text"
          />
          <button className="postBtns" type="submit">
            Answer
          </button>
        </form>
      ) : (
        ""
      )}
      <div className="postInfo">
        <p style={{ marginRight: "10px", fontSize: "12px" }}>
          posted by <i>{questionData.by ? `${questionData.by}` : ""}</i> |{" "}
          {questionData.rating
            ? ` Upvotes ${questionData.rating}`
            : "No upvotes yet!"}
        </p>
      </div>
    </div>
  );
};

export default ForumQuestion;
