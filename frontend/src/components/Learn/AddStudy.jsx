/* eslint-disable no-unused-vars */
import { useContext, useRef, useState } from "react";
import { AddMaterial } from "../Api/Api";
import Axios from "axios";
import { UserContext } from "../../App";
import Loading from "../Loading";
// import { RingLoader } from "react-spinners/RingLoader";
import "./Add.css";

const AddStudy = () => {
  const { loading, setLoading, status, setStatus } = useContext(UserContext);
  const [data, setData] = useState({
    topic: "Pure Mathematics I",
    title: "",
    about: "",
    subtopic: "",
    url:""
  });

  const theDrop = useRef();

  const addMaterial = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    
    const resources = await Axios.post("http://localhost:8000/resources", data);
   
      if (resources.status === 201) {
       setStatus("Added Resource!");
        setTimeout(()=>{
         setStatus("")
        },2000)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setData({topic:"Pure Mathematics I",title:"",about:"",subtopic:""})
      theDrop.current="Pure Mathematics I"
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDrop = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  


  return (
    <>
      {loading ? (
        <Loading/>
      ) : (
        <div className="addQues">
          <h1>Adding Learning Resources 📚🐳</h1>
          <form onSubmit={addMaterial}>
            <select onChange={handleDrop} name="topic" ref={theDrop}>
              <option value="Pure Mathematics I">Pure Math 1</option>
              <option value="Probability And Statistics">Statistics</option>
            </select>
            <input
              onChange={handleChange}
              name="title"
              placeholder="Enter title"
              type="text"
            ></input>
            <input
              onChange={handleChange}
              name="about"
              placeholder="Enter about"
              type="text"
            ></input>

            <input
              onChange={handleChange}
              name="subtopic"
              placeholder="Enter subtopic"
              type="text"
            ></input>
            <input
              onChange={handleChange}
              name="url"
              placeholder="Enter Link"
              type="text"
            ></input>
            <button type="submit">Add Resource</button>
          </form>
          <p>{status}</p>
        </div>
      )}
    </>
  );
};

export default AddStudy;
