import "./navBar.css";
import "../../pages/main.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <div className="navBar">
        <img className="siteLogo" src="https://img.icons8.com/plasticine/100/elephant.png" />
        <nav className="navContainer">
          <Link to={`/`} className="navItem">
            Home
          </Link>
          <Link to={`/select-course`} className="navItem">
            Courses
          </Link>
          <Link to={`/dashboard`} className="navItem">
            Dashboard
          </Link>
          <Link to={`/resources`} className="navItem">
            Resources
          </Link>
          <Link to={`/examdashboard`} className="navItem">
            Exams
          </Link>
          <Link to={`/forum`} className="navItem">
            Forum
          </Link>
        </nav>
        <div className="logContainer">
          <a className="loginBtn" href="login">
            Log out
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
