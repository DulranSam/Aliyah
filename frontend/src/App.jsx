/* eslint-disable no-unused-vars */
import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/home";
import UnknownPage from "./components/Error404/ErrorPage";
import Progressionmark from "./components/graphs/Progressionmark";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Login from "./pages/AccountPage/login";
import Register from "./pages/AccountPage/register";
import Authenticate from "./pages/AccountPage/Authenticate";
import AddQuestionsPage from "./pages/addQuestionsPage/addQuestions";
import AddLesson from "./pages/addLessonPage/addLesson";
import Scope from "./pages/TestPages/Scope";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage";
import ExamPage from "./pages/ExamPage/ExamPage";
import SelectCourses from "./pages/SelectCoursesPage/SelectCourses";
import SpecificCourse from "./pages/SelectCoursesPage/SpecificCourse";
import ExamReceipt from "./pages/ExamPage/ExamReceipt/ExamReceipt";
import ExamReview from "./pages/ExamPage/ExamReview/ExamReview";
import Learn from "./components/Learn/Learn";
import LearnBlueprint from "./components/Learn/LearnBlueprint";
import LearningResource from "./components/Learn/LearningResource";
import TopicalExam from "./components/Learn/TopicalExam";
import Forum from "./components/Forum/Forum";
import CreateForum from "./components/Forum/CreateForum";
import ForumSearch from "./components/Forum/ForumSearch";
import PastPaperScope from "./pages/PastPaperPage/pastPaperScope";
import ExamDashboard from "./components/ExamDashboard/ExamDashboard";
import Gemini from "./components/Gemini/Gemini"

export const UserContext = createContext();

function App() {
  const [loading, setLoading] = useState(false);
  const [topicalExam, setTopicalExam] = useState({});
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [voxalPoints, setVoxalpoints] = useState(0);
  const [hours, setHours] = useState(0);
  const [progress, setProgress] = useState([]);
  const [statValue, setstatValue] = useState([]);
  const [course, setCourse] = useState(0);
  const [ongoingCourse, setongoingCourses] = useState(0);
  const [user, setUser] = useState({ username: "", password: "" });
  const [completeCourse, setCompleteCourse] = useState(0);
  const [hoursLearned, setHoursLearned] = useState(0);
  const [pureMathLearnedProgress, setPureMathLearnedProgress] = useState(0);
  const [statLearnedProgress, setStatLearnedProgress] = useState(0);
  const [mathLesson, setMathLesson] = useState(0);
  const [statlLesson, setStatLesson] = useState(0);
  const [status, setStatus] = useState("");
  const [testedPureProgress, setPureTestedProgress] = useState(0);
  const [testedStatProgress, setStatTestedProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theTopic, setTheTopic] = useState("");
  const [source, setSource] = useState("");
  const [pureLessonCount, setPureLessonCount] = useState(0);
  const [statLessonCount, setStatLessonCount] = useState(0);
  const [userId, setUserId] = useState("");
  const [totalAnswers, setTotalAnswers] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [statisticsMarks, setStatisticsMarks] = useState([]);
  const [mathematicsMarks, setMathematicsMarks] = useState([]);
  const [totalMathsmarks, setTotalMathsmark] = useState([]);
  const [totalStatMarks, setTotalStatMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState([]);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState([]);
  const [transfer, setTransfer] = useState("");
  const [listofPureProb, setListOfPureProb] = useState({});
  const [listofStatProb, setListOfStatProb] = useState({});
  const [listofpureTopics, setListofPureTopics] = useState([]);
  const [listofStatTopics, setListStatTopics] = useState([]);
  const [shortenPureMaths, setshortenPureMaths] = useState([]);
  const [shortenstats, setshortenstats] = useState([]);

  const BASE = "https://aliyah-dlyb.onrender.com";

  const [loggedInUser, setLoggedInUser] = useState({});

  // Structuring the context value explicitly
  const contextValue = {
    topicalExam,
    setTopicalExam,
    search,
    setSearch,
    searched,
    setSearched,
    transfer,
    setTransfer,
    loggedInUser,
    setLoggedInUser,
    loading,
    setLoading: setLoading,
    value,
    setValue: setValue,
    data,
    setData,
    voxalPoints,
    setVoxalpoints,
    hours,
    isAuthenticated,
    setIsAuthenticated,
    setHours,
    progress,
    setProgress,
    statValue,
    setstatValue,
    course,
    setCourse,
    BASE,
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
    theTopic,
    setTheTopic,
    source,
    setSource,
    userId,
    setUserId,
    totalAnswers,
    setTotalAnswers,
    pureLessonCount,
    setPureLessonCount,
    statLessonCount,
    setStatLessonCount,
    examHistory,
    setExamHistory,
    statisticsMarks,
    setStatisticsMarks,
    mathematicsMarks,
    setMathematicsMarks,
    totalMathsmarks,
    setTotalMathsmark,
    totalStatMarks,
    setTotalStatMarks,
    totalMarks,
    setTotalMarks,
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
  };

  return (
    <UserContext.Provider value={contextValue}>
      <BrowserRouter>
      <Gemini/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/progression" element={<Progressionmark />} /> */}
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/add-question" element={<CreateForum />} />
          <Route path="/forum/search" element={<ForumSearch />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Register />} />
          {/* <Route path="/authenticate" element={<Authenticate />} /> */}
          <Route path="/past-papers" element={<PastPaperScope />} />
          <Route path="add-questions" element={<AddQuestionsPage />} />
          <Route path="/add-lesson" element={<AddLesson />} />
          <Route path="/select-course" element={<SelectCourses />} />
          <Route path="/select-course/:theTopic" element={<SpecificCourse />} />
          <Route path="exam/:examID" element={<ExamPage />} />
          <Route path="/scope" element={<Scope />}></Route>
          <Route path="receipt" element={<ExamReceipt />} />
          <Route path="/exam-review/:examID" element={<ExamReview />}></Route>
          <Route path="/scope" element={<Scope />}></Route>
          <Route path="/examdashboard" element={<ExamDashboard />} />
          <Route path="/resources" element={<Learn />} />
          <Route
            path="/learning/:source/:topic/:lesson"
            element={<LearningResource />}
          ></Route>
          <Route path="/topicalExam/:topic" element={<TopicalExam />}></Route>
          <Route path="/learnprint/:topic" element={<LearnBlueprint />}></Route>
          <Route path="/feedback" element={<FeedbackPage />}></Route>
          <Route path="*" element={<UnknownPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
