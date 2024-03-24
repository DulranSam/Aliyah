import { Link } from "react-router-dom";
import "./LoginError.css";
import "../../pages/main.css";

const LoginError = () => {
  return (
    <>
      <div className="loginErrorContainer">
        <h1>You are not logged in!</h1>
        <p>Your not logged in? Sad! Please login to continue! 😔</p>
        <Link className="linkBtn" to="/login">Click here to login.</Link>
      </div>
    </>
  );
};

export default LoginError;