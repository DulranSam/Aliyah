import React from "react";
import "./CourseComponent.css";
import updateCourses from "./updateCourses";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";
import ProgressBar from "@ramonak/react-progress-bar";
import Button from "@mui/material/Button";

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
        <p>{course.source}</p>
        <Button
          variant="contained"
          onClick={async () => {
            handleClick(course._id, course.sourceKey, BASE);
          }}
        >
          Start Course
        </Button>
      </div>
    );
  } else {
    const { maxLessons, lessonsCompleted } = progress;

    let completedPercentage = Math.floor((lessonsCompleted / maxLessons) * 100);
    return (
      <div className="courseContainer">
        <p>{course.source}</p>
        <div className="topicsContainer">
          <ul className="topicTagField">
            {course.topics.map((topic, i) => (
              <a href={`learnprint/${course.sourceKey}`}>{topic}</a>
            ))}
          </ul>
        </div>
        {completedPercentage == 0 ? (
          <ProgressBar
            completed={completedPercentage}
            bgcolor={"#6a1b9a"}
            labelAlignment={"outside"}
            labelColor={"#000000"}
            height={20}
          />
        ) : (
          <ProgressBar
            completed={completedPercentage}
            labelAlignment={"outside"}
            labelColor={"#000000"}
          />
        )}
      </div>
    );
  }
};

export default CourseComponent;
