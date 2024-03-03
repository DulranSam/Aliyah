/* eslint-disable no-unused-vars */
import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/home";
import UnknownPage from "./components/Error404/Unknown";
import Progressionmark from "./components/graphs/Progressionmark";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Login from "./components/graphs/login";
import regstration from "./components/graphs/Regstration";
import Regstration from "./components/graphs/Regstration";
import Authenticate from "./components/graphs/Authenticate";

export const UserContext = createContext();

function App() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const [data, setData] = useState(null);
  const [voxalPoints, setVoxalpoints] = useState(0);
  const [hours, setHours] = useState(0);
  const [progress, setProgress] = useState([]);
  const [statValue, setstatValue] = useState([]);
  const [course, setCourse] = useState(0);
  const [ongoingCourse, setongoingCourses] = useState(0);
  const [user,setUser] = useState({
    username:"",password:""
  })
  const [completeCourse,setCompleteCourse] = useState(0);
  const [hoursLearned,setHoursLearned] = useState(0);
  const [mathLearnedProgress,setMathLearnedProgress] = useState(0);
  const [statLearnedProgress,setStatLearnedProgress] = useState(0);
  const [mathLesson,setMathLesson] = useState(0);
  const [statlLesson,setStatLesson] = useState(0);
  const[isAuthenticated,setIsAuthenticated] = useState(false);
  
  const [lessons,setLessons]  =useState({
    //append all the individual states to an object
  })

  // Structuring the context value explicitly
  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    value: value,
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
    user,setUser,
    hoursLearned,
    setHoursLearned,
    completeCourse,
    setCompleteCourse,
    statLearnedProgress,
    setStatLearnedProgress,
    mathLearnedProgress,
    setMathLearnedProgress,
    mathLesson,
    setMathLesson,
    statlLesson,
    setStatLesson,
    isAuthenticated,setIsAuthenticated,
    lessons,setLessons
  };

  return (
    
    <UserContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progression" element={<Progressionmark />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Regstration />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="*" element={<UnknownPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
