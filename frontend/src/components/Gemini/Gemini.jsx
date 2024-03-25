/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { UserContext } from "../../App";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./Bot.css";

function Gemini() {
  const { loggedInUser, BASE, status, setStatus,user} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);

  const endPoint = `${BASE}/gemini`;

  let searchCounter = 0;

  useEffect(()=>{
    console.log(loggedInUser)
  },[loggedInUser])

  async function GatherData() {
    setData([]);
    try {
      setLoading(true);
      const response = await Axios.post(endPoint, {
        search,
        username: user.username,
      });
      if (response.status === 200) {
        searchCounter++;
      }
      setData(response.data);
    } catch (err) {
      if (err.status === 404) {
        setStatus("No results found!");
      }
    } finally {
      setLoading(false);
    }
  }

  const toggleModal = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    setSearch(`Greet me , my name is ${loggedInUser.username}!`);
    GatherData();
  }, []);

  return loggedInUser ? (
    <div className="botContainer">
      <div className="botBtn">
        <button className="modalBtn" onClick={toggleModal}>
          <img
            style={{ width: "40px", height: "40px" }}
            src="./images/chatbot.png"
            alt="chatbot-icon"
          />
        </button>
      </div>

      {menu && (
        <div className="modal">
          <h2>Gemini Chatbot</h2>
          <hr />
          <form onSubmit={(e)=>{e.preventDefault(),GatherData()}} className="formContainer">
            <h2 className="botMessage" style={{ color: "black" }}>
              {searchCounter === 0
                ? "Hi, I'm Vexy, how may I help you today! 🤖👋🏻"
                : "Anything else?"}
            </h2>
            <input
              className="botInput"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔎 Enter your prompt here..."
            />
            {loading ? (
              <div className="loaderContainer">
                <ScaleLoader color="#4a9dec" />
              </div>
            ) : (
              ""
            )}
            <br/>
            <p>{JSON.stringify(data.Data)}</p>
          </form>
          <hr />
          <p>{status}</p>
          <button onClick={toggleModal} className="closeModal">
            Close
          </button>
        </div>
      )}
    </div>
  ) : (
    ""
  );
}

export default Gemini;
