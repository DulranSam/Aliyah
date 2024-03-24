/* eslint-disable no-constant-condition */
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import Axios from "axios";
import "./SelectCourses.css";
import { UserContext } from "../../App";
import CourseComponent from "./CourseComponent";
import NavBar from "../../components/NavigationBar/navBar";
import { ClipLoader } from "react-spinners";

const SelectCourses = () => {
  const { BASE } = useContext(UserContext);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const [userStartedCourses, setUserStartedCourses] = useState([]);
  const [userNotStartedCourses, setNotStartedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lessonProgress, setLessonProgress] = useState([]);

  const initializeProgress = async (sourceKey) => {
    const response = await Axios.post(`${BASE}/course/getProgress`, {
      sourceKey: sourceKey,
      userID: loggedInUser._id,
    });

    setLessonProgress((prevLessonProgress) => [
      ...prevLessonProgress,
      response.data,
    ]);
  };

  useEffect(() => {
    if (userNotStartedCourses.length > 0) {
      setLoading(true);
    } else if (lessonProgress.length > 0) {
      setLoading(true);
    }
  }, [userNotStartedCourses, lessonProgress]);

  const retrieveCourses = async (userCourses) => {
    try {
      const response = await Axios.post(`${BASE}/course/getModules`, {
        courses: userCourses,
      });

      console.log(response.data);

      setUserStartedCourses(response.data.userInProgress);
      setNotStartedCourses(response.data.userNotStarted);
    } catch (error) {
      console.error(error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  };
  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  useEffect(() => {
    if (Object.keys(loggedInUser).length > 0) {
      const sourceKeys = [];

      loggedInUser.lesson.forEach((lessonProgress) => {
        sourceKeys.push(lessonProgress.source);
      });

      console.log(sourceKeys);

      retrieveCourses(sourceKeys);
    }
  }, [loggedInUser]);
  // Your code here

  useEffect(() => {
    if (userStartedCourses.length > 0) {
      console.log(userStartedCourses);
    }

    if (userNotStartedCourses.length > 0) {
      console.log(userNotStartedCourses);
    }
  }, [userStartedCourses, userNotStartedCourses]);

  useEffect(() => {
    if (userStartedCourses.length > 0) {
      userStartedCourses.forEach((course) => {
        initializeProgress(course.sourceKey);
      });
    }
  }, [userStartedCourses]);

  return loading ? (
    <div>
      <NavBar />
      <div className="course-type-container">
        <div className="select-courses-txt">
          <h1>Select Courses</h1>
          <p>Welcome {loggedInUser.username} 👋</p>
        </div>
        {userStartedCourses &&
        lessonProgress.length == userStartedCourses.length ? (
          <div className="course-container">
            <h1>Courses In Progress</h1>
            {userStartedCourses.length == 0 ? (
              <p>No Courses Started!!</p>
            ) : (
              userStartedCourses.map((course, i) => (
                <div key={i}>
                  <CourseComponent
                    course={course}
                    completedFlag={true}
                    progress={{
                      maxLessons: lessonProgress.find(
                        (progress) => progress.sourceKey === course.sourceKey
                      )?.noOfLessonCount,
                      lessonsCompleted: lessonProgress.find(
                        (progress) => progress.sourceKey === course.sourceKey
                      )?.completedLessonCount,
                    }}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <p>Loading Course</p>
        )}
        {userNotStartedCourses ? (
          <div className="course-container">
            <div>
              <h1>Not Started Courses</h1>
              {userNotStartedCourses.length == 0 ? (
                <p>All Courses Started!!</p>
              ) : (
                userNotStartedCourses.map((course, i) => (
                  <div key={i}>
                    <CourseComponent course={course} completedFlag={false} />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p>Loading Course</p>
        )}
      </div>
    </div>
  ) : (
    <div className="loader-container">
      <ClipLoader size={450} color="#1fa3d5" loading={true} />
    </div>
  );
};

export default SelectCourses;
