import React from "react";
import "./CourseComponent.css";
import updateCourses from "./updateCourses";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";
import ProgressBar from "@ramonak/react-progress-bar";

const handleClick = async (courseRef, courseKey, BASE) => {
  let loggedInUser = JSON.parse(sessionStorage.getItem("loggedUser")).data;

  try {
    await updateCourses(loggedInUser._id, courseRef, courseKey, BASE);
  } catch (error) {
    console.error(error);
  }
};

const CourseComponent = ({ course, completedFlag, progress }) => {
  const { BASE } = useContext(UserContext);
  if (completedFlag == false) {
    return (
      <div className="courseContainer">
        <h2>{course.source}</h2>
        <div className="topicsContainer">
          <ul className="topicTagField">
            {course.topics.map((topic, i) => (
              <Link to={topic} key={i}>
                <li key={i}>{topic}</li>
              </Link>
            ))}
          </ul>
        </div>
        <button
          onClick={async () => {
            handleClick(course._id, course.sourceKey, BASE);
          }}
        >
          Start Course
        </button>
      </div>
    );
  } else {
    const { maxLessons, lessonsCompleted } = progress;

    let completedPercentage = Math.floor((lessonsCompleted / maxLessons) * 100);
    return (
      <div className="courseContainer">
        <h2>{course.source}</h2>
        <div className="topicsContainer">
          <ul className="topicTagField">
            {course.topics.map((topic, i) => (
              <Link to={topic} key={i}>
                <li key={i}>{topic}</li>
              </Link>
            ))}
          </ul>
        </div>
        {completedPercentage == 0 ? (
          <ProgressBar
            completed={completedPercentage}
            bgcolor={"#6a1b9a"}
            labelAlignment={"outside"}
            labelColor={"#00000"}
            height={20}
          />
        ) : (
          <ProgressBar
            completed={completedPercentage}
            labelAlignment={"outside"}
            labelColor={"#00000"}
          />
        )}
      </div>
    );
  }
};

export default CourseComponent;
