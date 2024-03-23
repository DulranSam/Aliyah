import Axios from "axios"; // Assuming you've installed frontend-friendly axios
import initializeProbabilities from "../FeedbackPage/initializeProbabilities";
import updateLoggedUser from "./updateLoggedUser";

const updateCourses = async (userId, courseRef, courseKey, BASE) => {
  const response = await Axios.post(`${BASE}/course/getLessons`, {
    topic: courseKey,
  });

  const lessonTitleArr = response.data;

  let topicArr = [];
  let lessonsArr;

  lessonTitleArr.forEach((topic) => {
    lessonsArr = [];
    topic.lessons.forEach((lesson) => {
      lessonsArr.push({
        lessonName: lesson.lessonTitle, // Access the property
        completed: false,
      });
    });
    topicArr.push({
      topic: topic.topic, // Access the property
      lessonProgress: lessonsArr,
    });
  });

  const topicLessonArr = {
    source: courseKey,
    topicRef: courseRef,
    topicLesson: topicArr,
  };

  const res = await Axios.post(`${BASE}/user/intialiazeLessons`, {
    userId: userId,
    newLessonProgress: topicLessonArr,
  });

  console.log(res.data);

  await updateLoggedUser(userId, BASE).then(() => {});

  // No need to parse JSON again
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedUser")).data;

  await initializeProbabilities(courseKey, BASE).then((result) => {
    console.log(result);

    async function updateModuleProbability(BASE) {
      await Axios.post(`${BASE}/user/updateModuleProbabilities`, {
        userId: loggedInUser._id,
        source: courseKey,
        topicProbabilities: result,
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    updateModuleProbability(BASE);

    window.location.href = "/select-course";
  });

  return response.data;
};

export default updateCourses;
