import { useState, useReducer, useEffect, useContext } from "react";
import Axios from "axios";
import "./pastPaperScope.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const PastPaperScope = () => {
  const navigator = useNavigate();

  const { loggedInUser, setLoggedInUser, BASE } = useContext(UserContext);

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  const initialState = {
    modules: {},
    selectedSeason: "s",
    selectedYear: "2018",
    selectedModule: "",
    selectedVariant: "1",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_MODULES":
        return { ...state, modules: action.payload };
      case "SELECT_SEASON":
        return { ...state, selectedSeason: action.payload };
      case "SELECT_YEAR":
        return { ...state, selectedYear: action.payload };
      case "SELECT_MODULE":
        return { ...state, selectedModule: action.payload };
      case "SELECT_VARIANT":
        return { ...state, selectedVariant: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const [selectedModuleState, setSelectedModuleState] = useState("");
  const [modulesArr, setModulesArr] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionIDs, setQuestionIDs] = useState([]);

  const getModules = async () => {
    try {
      const response = await Axios.get(
        `${BASE}/addQuestion/getModulesForPastPaper`
      );

      dispatch({ type: "FETCH_MODULES", payload: response.data });
      dispatch({
        type: "SELECT_MODULE",
        payload: response.data[0]["sourceKey"],
      });

      setSelectedModuleState(response.data[0]["source"]);

      const sourceValues = Object.values(response.data).map(
        (obj) => obj.source
      );

      setModulesArr(sourceValues);
    } catch (error) {
      console.log(error);
    }
  };

  let fetched = 0;

  const fetchQuestions = async () => {
    try {
      const response = await Axios.post(`${BASE}/getQuestionsOnTopic`, {
        scopeQuery: `${state.selectedSeason}_${state.selectedYear}_${state.selectedVariant}`,
        moduleScope: `${state.selectedModule}`,
      });

      if (response.data.length === 0) {
        alert("No questions found under this past paper!");
        setQuestions([]);
        return;
      }
      setQuestions(response.data);
      fetched++;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getModules();
  }, []);

  const createExam = async () => {
    await Axios.post(`${BASE}/exam/saveExam`, {
      examType: "Past Paper",
      examQuestions: questionIDs,
      userRef: loggedInUser._id,
      examModule: selectedModuleState,
      examTopic: "None",
    })
      .then(function (response) {
        navigator(`/exam/${response.data[0].Alert}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (questions.length > 0) {
      let questionIDArray = [];

      for (const i in questions) {
        questionIDArray.push(questions[i].questionID);
      }

      setQuestionIDs(questionIDArray);
    }
  }, [questions]);

  useEffect(() => {
    if (questionIDs.length > 0) {
      createExam();
    }
  }, [questionIDs]);

  const handleModuleChange = (event) => {
    for (let i = 0; i < state.modules.length; i++) {
      if (state.modules[i].source === event.target.value) {
        dispatch({
          type: "SELECT_MODULE",
          payload: state.modules[i].sourceKey,
        });

        setSelectedModuleState(state.modules[i].source);
        break;
      }
    }
  };

  const handleSeasonChange = (event) => {
    dispatch({ type: "SELECT_SEASON", payload: event.target.value });
  };

  const handleYearChange = (event) => {
    dispatch({ type: "SELECT_YEAR", payload: event.target.value });
  };

  const handleVariantChange = (event) => {
    dispatch({ type: "SELECT_VARIANT", payload: event.target.value });
  };

  return (
    <div className="bodyDiv">
      {modulesArr.length > 0 && (
        <>
          <label htmlFor="moduleDropdown"> Select Module : </label>
          <select
            name="moduleDropdown"
            id="moduleDropdown"
            onChange={handleModuleChange}
            value={selectedModuleState}
          >
            {modulesArr.map((module, index) => (
              <option key={`module_${index}`} value={module}>
                {module}
              </option>
            ))}
          </select>

          <label htmlFor="yearDropdown"> Select Year : </label>
          <select id="yearDropdown" onChange={handleYearChange}>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={`year_${2015 + i}`} value={2015 + i}>
                {2015 + i}
              </option>
            ))}
          </select>

          <label htmlFor="seasonDropDown"> Select Season : </label>
          <select id="seasonDropDown" onChange={handleSeasonChange}>
            <option value="s">May/June</option>
            <option value="w">October/November</option>
          </select>

          <label htmlFor="variantDropDown"> Select Variant : </label>
          <select id="variantDropDown" onChange={handleVariantChange}>
            {Array.from({ length: 3 }, (_, i) => (
              <option key={`variant_${i + 1}`} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <p>
            Selected Module:
            <strong>
              {state.selectedModule === "p1"
                ? "Pure Mathematics 1"
                : "Probability and Statistics I"}
            </strong>
          </p>
          <p>
            Selected Season:
            {state.selectedSeason === "s" ? "May/June" : "October/November"}
          </p>
          <p>
            Selected Year: <strong>{state.selectedYear}</strong>
          </p>

          <p>
            Selected Variant: <strong>{state.selectedVariant}</strong>
          </p>

          <button onClick={fetchQuestions}>Get Past Paper</button>

          {questions && questions.length > 0 ? (
            <ul>
              {questions.map((question, i) => (
                <li key={i}>
                  <p>{question.questionID}</p>
                </li>
              ))}
            </ul>
          ) : fetched === 1 ? (
            <p>No questions found</p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default PastPaperScope;
