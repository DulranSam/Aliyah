/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Axios from "axios";
import { Link } from "react-router-dom";
import PastPaperScope from "../../pages/PastPaperPage/pastPaperScope";
import FeedbackPage from "../../pages/FeedbackPage/FeedbackPage";
import updateLoggedUser from "../../pages/SelectCoursesPage/updateLoggedUser";
import "./ExamDashboard.css";
import NavBar from "../NavigationBar/navBar";
import { CircularProgressbar } from "react-circular-progressbar";

const ExamDashboard = () => {
  const { BASE } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const [loggedInUser, setLoggedInUser] = useState({});
  const [userId, setUserId] = useState("");

  const [examDashboard, setExamDashboard] = useState({
    feedbackExams: [],
    topicalExams: [],
    pastPapersExams: [],
  });

  async function FetchExamData() {
    try {
      const response = await Axios.post(`${BASE}/examDashboard/getExams`, {
        userId: loggedInUser._id,
      });
      if (response.status === 200) {
        console.log(response.data);
        setExamDashboard(response.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("Error!");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem("loggedUser")).data._id);
  }, []);

  useEffect(() => {
    if (userId) {
      updateLoggedUser(userId, BASE).then(() => {
        setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (Object.keys(loggedInUser).length) {
      FetchExamData();
    }
  }, [loggedInUser]);

  useEffect(() => {
    console.log(examDashboard);
  }, [examDashboard]);

  const [doModelExam, setDoModelExam] = useState(false);

  return loading ? (
    <h1 className="loading-header" style={{ margin: "40px" }}>
      Loading...
    </h1>
  ) : (
    <div className="the-main">
      <NavBar />
      <div className="exam-dashboard-container">
        <h1 style={{ marginBottom: "40px" }}>Exam Dashboard</h1>
        <div className="dashboard-content">
          {examDashboard.feedbackExams.length ||
          examDashboard.topicalExams.length ||
          examDashboard.pastPapersExams.length ? (
            <>
              <div className="feedback">
                <h2>Feedback Exams</h2>
                {examDashboard.feedbackExams.map((x) => (
                  <div
                    key={x._id}
                    className="card changingCard"
                    id="changingCard"
                  >
                    <h1>{x.examModule}</h1>
                    <div className="progressbar">
                      {/* <CircularProgressbar
                        value={Math.round((x.mark / x.totalMark) * 100)}
                        text={`${Math.round((x.mark / x.totalMark) * 100)}%`}
                        styles={{
                          path: {
                            // Use the progress percentage to determine the opacity
                            stroke: `rgba(62, 152, 199, ${
                              Math.round((x.mark / x.totalMark) * 100) / 100
                            })`,
                          },
                          text: {
                            // Adjust text color as needed
                            fill: "#f88",
                          },
                        }}
                      /> */}
                    </div>
                    <p>{`${Math.round(
                      (x.mark / x.totalMark) * 100
                    )}% Completed`}</p>
                    <Link to={`/exam-review/${x._id}`}>
                      Click to view more info!
                    </Link>
                  </div>
                ))}
              </div>
              <div className="topical">
                <h2>Topical Exams</h2>
                <div className="card-container">
                  {examDashboard.topicalExams.map((x) => (
                    <div
                      key={x._id}
                      className="card changingCard"
                      id="changingCard"
                      style={{ marginRight: "100px" }}
                    >
                      <h1>{x.examModule}</h1>
                      {/* <div className="progressbar">
                        <CircularProgressbar
                          value={Math.round((x.mark / x.totalMark) * 100)}
                          text={`${Math.round((x.mark / x.totalMark) * 100)}%`}
                          styles={{
                            path: {
                              // Use the progress percentage to determine the opacity
                              stroke: `rgba(62, 152, 199, ${
                                Math.round((x.mark / x.totalMark) * 100) / 100
                              })`,
                            },
                            text: {
                              // Adjust text color as needed
                              fill: "#f88",
                            },
                          }}
                        />
                      </div> */}
                      <p>{`${Math.round(
                        (x.mark / x.totalMark) * 100
                      )}% Completed`}</p>
                      <p>{x.examTopic}</p>
                      <Link to={`/exam-review/${x._id}`}>
                        Click to view more info!
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pastpaperex">
                <h2>Past Paper Exams</h2>
                {examDashboard.pastPapersExams &&
                  examDashboard.pastPapersExams.map((x) => (
                    <div
                      key={x._id}
                      className="card changingCard"
                      id="changingCard"
                      style={{ marginRight: "100px" }}
                    >
                      <h1>{x.examModule}</h1>
                      {/* <div className="progressbar">
  
                        <CircularProgressbar
                          value={Math.round((x.mark / x.totalMark) * 100)}
                          text={`${Math.round((x.mark / x.totalMark) * 100)}%`}
                          styles={{
                            path: {
                              // Use the progress percentage to determine the opacity
                              stroke: `rgba(62, 152, 199, ${
                                Math.round((x.mark / x.totalMark) * 100) / 100
                              })`,
                            },
                            text: {
                              // Adjust text color as needed
                              fill: "#f88",
                            },
                          }}
                        />
                      </div> */}

                      <p>{`${Math.round(
                        (x.mark / x.totalMark) * 100
                      )}% Completed`}</p>
                      <Link to={`/exam-review/${x._id}`}>
                        Click to view more info!
                      </Link>
                    </div>
                  ))}
                <button
                  onClick={() => setDoModelExam(!doModelExam)}
                  style={{ padding: "20px", marginTop: "10px" }}
                >
                  {!doModelExam ? `Do Model Exam!` : `Close Menu!`}
                </button>
                {doModelExam ? <PastPaperScope /> : null}
                <div className="feedbackex">
                  <h2>Start Feedback Exam</h2>
                  <FeedbackPage />
                </div>
              </div>
            </>
          ) : (
            <h1>No results found!</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;
