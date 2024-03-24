/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../main.css";
import "./DashboardPage.css";
import ProgressGraph from "../../components/graphs/Progressionmark";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Axios from "axios";
import axios from "axios";
import Progressionmark from "../../components/graphs/Progressionmark";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavigationBar/navBar";

// Dashboard Header Tab
function DashboardHeader() {
  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
    </>
  );
}

// Dashboard Graph Tab
function DashboardGraph() {
  return (
    <>
      <div className="dashboard-graph-container">
        <h2 className="graph-title">Progress</h2>
        <div className="graph-db">
          <Progressionmark />
        </div>
      </div>
    </>
  );
}

// Dashboard Statistics Tab
function DashboardStatistics({
  voxal,
  ongoingCourses,
  completedCourses,
  hoursLearned,
}) {
  return (
    <>
      <div className="dashboard-statistics-container">
        <h2 className="statistics-title">Statistics</h2>
        <div className="statistics-tab">
          <div className="points-tab">
            <h3 className="tab-header">VoXel Points Earned</h3>
            <p className="st-num vox-num">{voxal}</p>
          </div>
          <div className="points-tab">
            <h3 className="tab-header">Hours Learned</h3>
            <p className="st-num hour-num">{hoursLearned}</p>
          </div>
          <div className="points-tab">
            <h3 className="tab-header">Ongoing Courses</h3>
            <p className="st-num ongcourses-num">{ongoingCourses}</p>
          </div>
          <div className="points-tab">
            <h3 className="tab-header">Completed Courses</h3>
            <p className="st-num comcourses-num">{completedCourses}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Dashboard Courses Tab
function DashboardCourses() {
  const { loggedInUser, setLoggedInUser, examHistory, setExamHistory } =
    useContext(UserContext);
  const {
    statLearnedProgress,
    pureMathLearnedProgress,
    mathLesson,
    statlLesson,
    testedPureProgress,
    testedStatProgress,
    setPureTestedProgress,
    setStatTestedProgress,
    pureLessonCount,
    statLessonCount,
    statisticsMarks,
    setStatisticsMarks,
    mathematicsMarks,
    setMathematicsMarks,
    totalMathsmarks,
    setTotalMathsmark,
    totalStatMarks,
    setTotalStatMarks,
  } = useContext(UserContext);

  useEffect(() => {
    setExamHistory(loggedInUser.data);
  }, [loggedInUser]);

  useEffect(() => {
    let tempStatisticsMarks = [];
    let totaltempStatMarks = [];
    let tempMathematicsMarks = [];
    let totaltempMathsMarks = [];
    if (Array.isArray(examHistory)) {
      examHistory.forEach((exam) => {
        // Changed '.foreach' to '.forEach'
        if (exam.examModule === "Probability & Statistics I") {
          tempStatisticsMarks.push(exam.mark);
          totaltempStatMarks.push(exam.totalMark);
        } else if (exam.examModule === "Pure Mathematics I") {
          tempMathematicsMarks.push(exam.mark);
          totaltempMathsMarks.push(exam.totalMark);
        }
      });
      setMathematicsMarks(tempMathematicsMarks);
      setStatisticsMarks(tempStatisticsMarks);
      setTotalMathsmark(totaltempMathsMarks);
      setTotalStatMarks(totaltempStatMarks);
    }
  }, [examHistory]);

  useEffect(() => {
    console.log("logged in user:");
    console.log(loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    const correcttotalStatmarks = statisticsMarks.reduce(
      (acc, current) => acc + current,
      0
    );
    const totalStatmark = totalStatMarks.reduce(
      (acc, current) => acc + current,
      0
    );

    const correcttotalPuremaths = mathematicsMarks.reduce(
      (acc, current) => acc + current,
      0
    );
    const totalPureMaths = totalMathsmarks.reduce(
      (acc, current) => acc + current,
      0
    );

    const averageStatMarks = Math.round(
      (correcttotalStatmarks / totalStatmark) * 100,
      2
    );
    const averagePureMarks = Math.round(
      (correcttotalPuremaths / totalPureMaths) * 100,
      2
    );

    console.log(averagePureMarks);
    console.log(averageStatMarks);

    setStatTestedProgress(averageStatMarks);
    setPureTestedProgress(averagePureMarks);
  }, [statisticsMarks, totalStatMarks, mathematicsMarks, totalMathsmarks]);

  return (
    <>
      {/* {data && data.length ? data.map((course) => (
            
          )) : <h1>No results found!</h1>} */}
      <div>
        <div className="dashboard-courses">
          <h2 className="courses-header">My Courses</h2>
          <div className="courses-tab">
            <div className="course-card">
              <div className="course-title">Pure Mathematics I</div>
              <div className="course-lessons">{mathLesson} lessons</div>
              <div className="course-progress-tab">
                <div className="prog-bar">
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={pureLessonCount ? pureLessonCount : 0}
                      text={`${pureLessonCount ? pureLessonCount : 0}%`}
                      styles={{
                        path: {
                          // Use the progress percentage to determine the opacity
                          stroke: `rgba(62, 152, 199, ${
                            pureLessonCount ? pureLessonCount / 100 : 0
                          })`,
                        },
                        text: {
                          // Adjust text color as needed
                          fill: "#f88",
                        },
                      }}
                    />
                  </div>
                  <p className="prog-bar-text">Learned Progress</p>
                </div>
                <div className="prog-bar">
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={testedPureProgress ? testedPureProgress : 0}
                      text={`${testedPureProgress ? testedPureProgress : 0}%`}
                      styles={{
                        path: {
                          // Use the progress percentage to determine the opacity
                          stroke: `rgba(62, 152, 199, ${
                            testedPureProgress / 100
                          })`,
                        },
                        text: {
                          // Adjust text color as needed
                          fill: "#f88",
                        },
                        // Customize the text color and style as needed
                      }}
                    />
                  </div>
                  <p className="prog-bar-text">Tested Progress</p>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-title">Statistics</div>
              <div className="course-lessons">{statlLesson} lessons</div>
              <div className="course-progress-tab">
                <div className="prog-bar">
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={statLessonCount ? statLessonCount : 0}
                      text={`${statLessonCount ? statLessonCount : 0}%`}
                      styles={{
                        path: {
                          stroke: `rgba(62, 152, 199, ${
                            statLessonCount / 100
                          })`,
                        },
                        text: {
                          // Adjust text color as needed
                          fill: "rgba(62, 152, 199)",
                        },
                        // Customize the text color and style as needed
                      }}
                    />
                  </div>
                  <p className="prog-bar-text">Learned Progress</p>
                </div>
                <div className="prog-bar">
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={testedStatProgress ? testedStatProgress : 0}
                      text={`${testedStatProgress ? testedStatProgress : 0}%`}
                      styles={{
                        path: {
                          stroke: `rgba(62, 152, 199, ${
                            testedStatProgress / 100
                          })`,
                        },
                        text: {
                          // Adjust text color as needed
                          fill: "rgba(62, 152, 199)",
                        },
                        // Customize the text color and style as needed
                      }}
                    />
                    <p className="prog-bar-text">Tested Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardActivity() {
  const {
    data,
    listofPureProb,
    setListOfPureProb,
    listofStatProb,
    setListOfStatProb,
    BASE,
    listofpureTopics,
    listofStatTopics,
    shortenPureMaths,
    shortenstats,
  } = useContext(UserContext);
  const [sortedPureData, setSortedPureData] = useState([]);
  const [sorterdStatData, setSortedStatData] = useState([]);

  let statFeedback = [];
  let pureMathsFeedback = [];
  const getPureIndexes = [];
  const getStatIndexes = [];
  let lessonPureMath = [];
  let statlesson = [];

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const sortThearraybyFeedback = (obj) => {
    if (!obj || typeof obj !== "object" || Object.keys(obj).length === 0) {
      // If the object is null, undefined, or not an object, or is empty,
      // return an empty array or handle it as per your requirements
      return [];
    }
    // Create an array of [key, value] pairs from the object
    const entriesArray = Object.entries(obj);
    // Sort the array by the value, which is at index 1 of the entry ([key, value])
    const sortedArray = entriesArray.sort((a, b) => b[1] - a[1]);

    // Return the sorted array
    return sortedArray;
  };

  useEffect(() => {
    const sortedPure = sortThearraybyFeedback(listofPureProb);
    console.log(sortedPure);
    setSortedPureData(sortedPure);

    const sortedStat = sortThearraybyFeedback(listofStatProb);
    console.log(sortedStat);
    // Update state or perform actions with sortedStat...
    setSortedStatData(sortedPure);
  }, [listofPureProb, listofStatProb]);

  const sortedPure = sortThearraybyFeedback(listofPureProb);
  const sortStat = sortThearraybyFeedback(listofStatProb);

  console.log(sortedPure);
  console.log(sortStat);

  for (let i = 0; i < 3; i++) {
    pureMathsFeedback[i] = sortedPure[i];
  }
  console.log(pureMathsFeedback);
  for (let i = 0; i < 3; i++) {
    statFeedback[i] = sortStat[i];
  }
  const firstPureElements = pureMathsFeedback.map(
    (subArray) => subArray?.[0] ?? ""
  );
  const firstStatElements = statFeedback.map((subArray) => subArray?.[0] ?? "");
  const firstPureFeedback = pureMathsFeedback.map(
    (subArray) => subArray?.[1] ?? ""
  );
  const firststatFeedback = statFeedback.map((subArray) => subArray?.[1] ?? "");

  console.log(statFeedback);
  console.log(pureMathsFeedback);
  console.log(firstPureElements);
  console.log(firstStatElements);
  console.log(shortenPureMaths);
  console.log(shortenstats);

  console.log(listofpureTopics);
  console.log(listofStatTopics);
  console.log(firstPureFeedback);
  console.log(firststatFeedback);

  function getMatchingIndexesFromSecondArray(array1, array2) {
    const matchingIndexes = [];
    array1.forEach((element) => {
      const indexInArray2 = array2.indexOf(element);
      if (indexInArray2 !== -1) {
        matchingIndexes.push(indexInArray2);
      }
    });
    return matchingIndexes;
  }

  // Usage
  const purelessonIndexes = getMatchingIndexesFromSecondArray(
    firstPureElements,
    shortenPureMaths
  );
  console.log(purelessonIndexes); // Outputs indexes from shortenPureMaths
  const pureMathslessonTopics = purelessonIndexes.map(
    (index) => listofpureTopics[index].topic
  );
  console.log(pureMathslessonTopics);

  const statlessonIndexes = getMatchingIndexesFromSecondArray(
    firstStatElements,
    shortenstats
  );
  console.log(statlessonIndexes); // Outputs indexes from shortenstats
  const statlessonTopics = statlessonIndexes.map(
    (index) => listofStatTopics[index].topic
  );
  console.log(statlessonTopics);

  // Check if data is null before accessing its properties

  return (
    loggedInUser && (
      <div className="dashboard-activity" style={{margin:"40px",padding:"40px"}}>
        <h1>Feedback</h1>
        <h5 className="feedback-headers">Pure Mathematics I</h5>
        <div className="Mathstopics">
          {pureMathslessonTopics.length > 0 && firstPureFeedback.length > 0 ? (
            pureMathslessonTopics
              .filter((_, id) => firstPureFeedback[id] > 0)
              .map((item, id) => (
                <div key={id} className="maths">
                  <h5>The probability of getting the topic {item} wrong is</h5>
                  <h5>{(firstPureFeedback[id] * 100).toFixed(2)}%</h5>
                </div>
              ))
          ) : (
            <h5>Nothing to display</h5>
          )}
        </div>

        <h5 className="feedback-headers">Probability & Statistics I</h5>
        <div className="statTopics">
          {statlessonTopics.length > 0 && firststatFeedback.length > 0 ? (
            statlessonTopics
              .filter((_, id) => firststatFeedback[id] > 0)
              .map((item, id) => (
                <div key={id} className="stats">
                  <h5>{item}</h5>
                  <h5>{(firststatFeedback[id] * 100).toFixed(2)}%</h5>
                </div>
              ))
          ) : (
            <h5>Nothing to display</h5>
          )}
        </div>
      </div>
    )
  );
}

// Dashboard Final Display Page
function DashboardPage() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const {
    BASE,
    loading,
    setLoading: setLoading,
    value,
    setValue: setValue,
    data,
    setData,
    voxalPoints,
    setVoxalpoints,
    hours,
    setHours,
    progress,
    setProgress,
    statValue,
    setstatValue,
    course,
    setCourse,
    ongoingCourse,
    setongoingCourses,
    user,
    setUser,
    hoursLearned,
    setHoursLearned,
    completeCourse,
    setCompleteCourse,
    statLearnedProgress,
    setStatLearnedProgress,
    pureMathLearnedProgress,
    setPureMathLearnedProgress,
    mathLesson,
    setMathLesson,
    statlLesson,
    setStatLesson,
    status,
    setStatus,
    testedPureProgress,
    setPureTestedProgress,
    testedStatProgress,
    setStatTestedProgress,
    isAuthenticated,
    userId,
    setUserId,
    pureLessonCount,
    setPureLessonCount,
    statLessonCount,
    setStatLessonCount,
    listofPureProb,
    setListOfPureProb,
    listofStatProb,
    setListOfStatProb,
    listofpureTopics,
    setListofPureTopics,
    listofStatTopics,
    setListStatTopics,
    shortenPureMaths,
    setshortenPureMaths,
    shortenstats,
    setshortenstats,
  } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(data);
        const sessionData = sessionStorage.getItem("loggedUser");
        if (sessionData) {
          const sessionUser = JSON.parse(sessionData).data;
          console.log(sessionUser);

          setVoxalpoints(sessionUser.voxelPoints);
          setHoursLearned(0); // Make sure to compute the correct value
          setListOfPureProb(sessionUser.topicProbabilities.p1);
          setListOfStatProb(sessionUser.topicProbabilities.s1);

          if (sessionUser.lesson && sessionUser.lesson.length > 0) {
            setPureMathLearnedProgress(sessionUser.lesson[0].topicLesson);
            setStatLearnedProgress(sessionUser.lesson[1].topicLesson);
          } else {
            // Handle the case where lesson is not an array or is empty
            setPureMathLearnedProgress(null);
          }
          console.log("Voxel Points:", sessionUser.voxelPoints);
          console.log(listofPureProb);
          console.log(listofStatProb);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(pureMathLearnedProgress);
    if (Array.isArray(pureMathLearnedProgress)) {
      // Assuming pureMathLearnedProgress is the array of topicLessons as seen in your screenshot
      const totalCount = pureMathLearnedProgress.reduce((total, topic) => {
        // Count the completed lessons within this topic's lessonProgress
        const completedCount = topic.lessonProgress.filter(
          (lesson) => lesson.completed
        ).length;
        // Add this topic's completed count to the total count
        return total + completedCount;
      }, 0); // Start with a total count of 0
      setMathLesson(totalCount);

      const totaNumber = pureMathLearnedProgress.reduce((total, topic) => {
        const totalCount = topic.lessonProgress.length + total;
        return totalCount;
      }, 0);

      const percentage = Math.round((totalCount / totaNumber) * 100, 2);
      console.log("The total number is" + percentage);
      setPureLessonCount(percentage);
    }
  }, [pureMathLearnedProgress]);

  ////for statistics

  useEffect(() => {
    if (Array.isArray(statLearnedProgress)) {
      const totalCount = statLearnedProgress.reduce((total, topic) => {
        const completeCount = topic.lessonProgress.filter(
          (lesson) => lesson.completed
        ).length;
        return total + completeCount;
      }, 0);

      setStatLesson(totalCount);
      const totalNumber = statLearnedProgress.reduce((total, topic) => {
        const totalCount = topic.lessonProgress.length + total;
        return totalCount;
      }, 0);
      const percentage = Math.round((totalCount / totalNumber) * 100, 2);
      setStatLessonCount(percentage);
    }
  }, [statLearnedProgress]);

  const id = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${BASE}/progression/get/hours`, {
          _id: id,
        });
        if (response) {
          setHoursLearned(response.data.hours);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [hoursLearned]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${BASE}/getTopics`, {
          sourceKey: "p1",
        });
        setListofPureTopics(response.data.topicLesson);
        setshortenPureMaths(response.data.topicKeys);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${BASE}/getTopics`, {
          sourceKey: "s1",
        });
        setshortenstats(response.data.topicKeys);
        setListStatTopics(response.data.topicLesson);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="dashboard-complete-container">
        <DashboardHeader />
        <div className="dashboard-main">
          <DashboardGraph />
          <DashboardStatistics
            voxal={voxalPoints}
            ongoingCourses={ongoingCourse}
            completedCourses={completeCourse}
            hoursLearned={hoursLearned}
          />
          <DashboardCourses />
          <DashboardActivity />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
