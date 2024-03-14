/* eslint-disable no-unused-vars */
import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route, useNavigation } from "react-router-dom";
import UnknownPage from "./components/Unknown";
import Learn from "./components/Learn/Learn";
import AddStudy from "./components/Learn/AddStudy";
import LearnBlueprint from "./components/Learn/LearnBlueprint";
import LearningResource from "./components/Learn/LearningResource";
import First from "./components/Learn/TestPages/First";
import Second from "./components/Learn/TestPages/Second";
import NextPage from "./components/Learn/NextPage";

export const UserContext = createContext();

function App() {
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(true);
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [theTopic, setTheTopic] = useState("");
  const [theProgressVal, setTheProgressVal] = useState(0);
  const BASE = "http://localhost:8000";

  // const navigator = useNavigation();

  // Create an object with the states and setter functions
  const userContextValue = {
    loading,
    setLoading,
    logged,
    setLogged,
    user,
    setUser,
    status,
    setStatus,
    response,
    setResponse,
    theTopic,
    setTheTopic,
    BASE,
    theProgressVal,
    setTheProgressVal,
  };

  return (
    <>
      {/**Needs to generally exist on the side with a popup type scenario! */}
      <BrowserRouter>
        <UserContext.Provider value={userContextValue}>
          <Routes>
            <Route path="/resources" element={<Learn />} />
            <Route path="/materials" element={<LearningResource />}></Route>
            <Route
              path="/materials/:index"
              element={<LearningResource />}
            ></Route>
            <Route path="/addresources" element={<AddStudy />} />
            <Route path="/nextpage/:id" element={<NextPage />} />
            <Route path="/first" element={<First />} />
            <Route path="/second" element={<Second />} />
            <Route path="/learnprint" element={<LearnBlueprint />}></Route>
            <Route path="*" element={<UnknownPage />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
