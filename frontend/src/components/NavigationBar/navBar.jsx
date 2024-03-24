import "./navBar.css";
import "../../pages/main.css";

const NavBar = () => {
  return (
    <>
      <div className="navBar">
        <nav className="navContainer">
          <a className="navItem" href="/">
            Home
          </a>
          <a className="navItem" href="select-course">
            Courses
          </a>
          <a className="navItem" href="dashboard">
            Dashboard
          </a>
          <a className="navItem" href="resources">
            Resources
          </a>
          <a className="navItem" href="examdashboard">
            Exams
          </a>
          <a className="navItem" href="forum">
            Forum
          </a>
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
