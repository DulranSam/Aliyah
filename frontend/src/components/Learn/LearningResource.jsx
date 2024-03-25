/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./LearningResource.css";
import NavBar from "../NavigationBar/navBar";

const LearningResource = () => {
  const navigate = useNavigate();
  const { source, topic, lesson } = useParams();

  const [topicRelated, setTopicRelated] = useState({});
  const [section, setSection] = useState([]);

  const {
    loading,
    setLoading,
    BASE,
    status,
    setStatus,
    loggedInUser,
    setLoggedInUser,
  } = useContext(UserContext);

  const IncrementProgress = async () => {
    try {
      const outcome = await Axios.put(`${BASE}/resources/progress/updates`, {
        userId: loggedInUser._id, //user.id
        topic: topic,
        source: source,
        lessonName: lesson,
      });

    } catch (error) {
      //
    }
  };

  const handleBtnClick = () => {
    let currentLessonIndex = null;
    let nextLesson = "";

    topicRelated.map((x, index) => {
      if (x.lessonName == lesson) {
        if (x.completed == false) {
          IncrementProgress().then(() => {
            setTimeout(() => {
              window.location.href = `/learning/${source}/${topic}/${nextLesson}`;
            }, 200);
          });
        } else {
          setStatus(`You have completed ${lesson}`);
        }
        currentLessonIndex = index;
      }
    });

    if (currentLessonIndex !== null) {
      if (currentLessonIndex + 1 < topicRelated.length) {
        nextLesson = topicRelated[currentLessonIndex + 1].lessonName;
      } else {
        nextLesson = topicRelated[0].lessonName;
      }
    }
    setTimeout(() => {
      window.location.href = `/learning/${source}/${topic}/${nextLesson}`;
    }, 100);
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedUser")).data);
  }, []);

  useEffect(() => {
    if (Object.keys(loggedInUser).length > 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await Axios.post(
            `${BASE}/resources/getLessonBodies`,
            {
              userId: loggedInUser._id,
              lessonTitle: lesson,
              topic: topic,
            }
          );
          setSection(response.data.lessonBody);
          1;
          setTopicRelated(response.data.lessonProgressReturn.lessonProgress);
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchData();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (Object.keys(topicRelated).length > 0) {
      if (Object.keys(section).length > 0) {
        setLoading(false);
      }
    }
  }, [topicRelated, section]);

  return loading ? (
    <h1 style={{ padding: "60px" }}>Loading...</h1>
  ) : (
    topicRelated && Object.keys(topicRelated).length > 0 && (
      <>
        <NavBar />

        <div style={{ display: "flex" }}>
          <Link to={`/learnprint/${source}`}>
            <button className="stlr-gb-btn">Go Back</button>
          </Link>
          <div
            className="sidebar"
            style={{
              width: "20%",
              marginRight: "20px",
              margin: "20px",
              padding: "20px",
              borderRight: "12px solid #17B169",
              borderWidth: "5px",
              borderRadius: "5px",
            }}
          >
            {topicRelated.map((x, index) => (
              <ul
                key={index}
                style={{
                  listStyleType: "none",
                  textDecoration: "none",
                  fontSize: 10,
                }}
              >
                <a
                  href={`/learning/${source}/${topic}/${x.lessonName}`}
                  style={{ textDecoration: "none", margin: "20px" }}
                >
                  {x.completed == false ? (
                    <h1 style={{ color: "red" }}>{x.lessonName}</h1>
                  ) : (
                    <h1 style={{ color: "green" }}>{x.lessonName}</h1>
                  )}
                </a>
              </ul>
            ))}
          </div>
          <div className="learnresources">
            <h1>{lesson}</h1>
            {Object.keys(section).length > 0 && (
              <div className="stlr-container">
                {section.lessonSection.map((sectionText, index) => (
                  <div className="img-stlr-container" key={index}>
                    <p className="section-text-learnresource">{sectionText}</p>
                    {section.sectionImgURL[index] !== "" && (
                      <img
                        src={section.sectionImgURL[index]}
                        onLoad={() => setLoading(false)}
                        alt={`Section ${index}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              className="stlr-next-btn"
              onClick={() => {
                handleBtnClick();
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      </>
    )
  );
};

export default LearningResource;
