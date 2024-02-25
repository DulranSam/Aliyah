/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import "./Forum.css";

const Forum = () => {
  const { loading, setLoading, status, setStatus, logged, user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState("");
  const [votes, setVotes] = useState(0);
  const navigator = useNavigate();
  const EndPoint = "http://localhost:8000/forum";
  
  useEffect(() => {
    forumData();
  }, []);

  const forumData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(EndPoint);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const increaseVotes = async (id) => {
    try {
      
    
      setLoading(true);
      // data.filter((x) => {
      //   totalVotes += x.rating[id];
      // });

      const upvote = await Axios.put(`${EndPoint}/upvotes/${id}`);
      if (upvote.status === 200) {
        setStatus("Upvoted!");
        window.location.reload();
      } else {
        setStatus("Error while upvoting!");
      }
      setTimeout(() => {
        navigator("/forum");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downVote = async (id) => {
    try {
      
    
      setLoading(true);
      // data.filter((x) => {
      //   totalVotes += x.rating[id];
      // });

      const upvote = await Axios.put(`${EndPoint}/downvotes/${id}`);
      if (upvote.status === 200) {
        setStatus("Down Voted!");
        window.location.reload();
      } else {
        setStatus("Error while upvoting!");
      }
      setTimeout(() => {
        navigator("/forum");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const AnsweringQuestions = async (id, answer) => {
    try {
      setLoading(true);
      const r = await Axios.put(`${EndPoint}/${id}`, { answer });
      if (r.data.status === 200) {
        setStatus("Answer Posted!");
        setTimeout(() => {
          navigator("/forum");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const DeleteComment = async (id) => {
    try {
      const deleteRequest = await Axios.delete(`${EndPoint}/${id}`);
      if (deleteRequest.status === 200) {
        alert("Deleted Question!");
        navigator("/forum");
      } else {
        alert("Couldn't delete question!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [down,setDown] = useState(0)

  useEffect(()=>{
    console.log(down);
  },[down])
 

  return logged ? (
    <div className="forumContainer">
      <h1>Welcome back, {user.username || user}!</h1>
      <br />
      <select onChange={(e)=>setDown(Number(e.target.value))}>
        <option value={0}>All</option>
        <option value={1}>Pure Math</option>
        <option value={2}>Statistics</option>
      </select>
      {loading ? (
        <h1>Loading...</h1>
      ) : data && data.length && down===0 ? (
        data.map((x) => (
          <div key={x._id}>
            <br />
            <br />
            <h1>{x.question}</h1>
            <h2>{x.description}</h2>
            <h1>{x?.answer ? x.answer : "Be the first to Answer! 🥳"}</h1>
            <p>{x.by ? `Posted by ${x.by}` : ""}</p>
            <p>{x.rating ? `Upvoted by ${x.rating}` : <h1>Rated by none!</h1>}</p>
            <button onClick={(e) => { e.preventDefault(); increaseVotes(x._id) }}>Upvote!</button>
            <button onClick={(e) => { e.preventDefault(); downVote(x._id) }}>DownVote!</button>
            <button onClick={(e) => { e.preventDefault(); DeleteComment(x._id) }}>Delete</button>
            <br />
            <form className="replyForm" onSubmit={(e) => { e.preventDefault(); AnsweringQuestions(x._id, answer) }}>
              <input onChange={(e) => { setAnswer(e.target.value) }} placeholder="Answer..." type="text" />
              <button type="submit">Answer!</button>
            </form>
            <br />
          </div>
        ))
      ) : data && data.length && down===1 ? (
        data.map((x) => (
          x.topic === "Pure Mathematics I" ? (
            <div key={x._id}>
              <br />
              <br />
              <h2>{x.topic}</h2>
              <h2>{x.description}</h2>
              <h1>{x.question}</h1>
              <h1>{x?.answer ? x.answer : "Be the first to Answer! 🥳"}</h1>
              <p>{x.by ? `Posted by ${x.by}` : ""}</p>
              <p>{x.rating ? `Upvoted by ${x.rating}` : <h1>Rated by none!</h1>}</p>
              <button onClick={(e) => { e.preventDefault(); increaseVotes(x._id) }}>Upvote!</button>
              <button onClick={(e) => { e.preventDefault(); downVote(x._id) }}>DownVote!</button>
              <button onClick={(e) => { e.preventDefault(); DeleteComment(x._id) }}>Delete</button>
              <br />
              <form onSubmit={(e) => { e.preventDefault(); AnsweringQuestions(x._id, answer) }}>
                <input onChange={(e) => { setAnswer(e.target.value) }} placeholder="Answer..." type="text" />
                <button type="submit">Answer!</button>
              </form>
              <br />
            </div>
          ) : null
        ))
      ) : data && data.length && down===2 ? (
        data.map((x) => (
          x.topic === "Probability And Statistics" ? (
            <div key={x._id}>
              <br />
              <br />
              <h2>{x.topic}</h2>
              <h2>{x.description}</h2>
              <h1>{x.question}</h1>
              <h1>{x?.answer ? x.answer : "Be the first to Answer! 🥳"}</h1>
              <p>{x.by ? `Posted by ${x.by}` : ""}</p>
              <p>{x.rating ? `Upvoted by ${x.rating}` : <h1>Rated by none!</h1>}</p>
              <button onClick={(e) => { e.preventDefault(); increaseVotes(x._id) }}>Upvote!</button>
              <button onClick={(e) => { e.preventDefault(); downVote(x._id) }}>DownVote!</button>
              <button onClick={(e) => { e.preventDefault(); DeleteComment(x._id) }}>Delete</button>
              <br />
              <form onSubmit={(e) => { e.preventDefault(); AnsweringQuestions(x._id, answer) }}>
                <input onChange={(e) => { setAnswer(e.target.value) }} placeholder="Answer..." type="text" />
                <button type="submit">Answer!</button>
              </form>
              <br />
            </div>
          ) : null
        ))
      ) : null}
      <p>{status}</p>
      <Link to="/addforum">Add question to forum? 🤔</Link>
    </div>
  ) : (
    <div><h1>Please <Link to="/login">login</Link> to continue to the forum </h1></div>
  );
}
  

export default Forum;
