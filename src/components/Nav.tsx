import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import "../App.css";

const Nav = () => {
  function toggleOpen(): void {
    const x = document.getElementById("links");

    if (x && x.style) {
      x.style.display = x.style.display === "block" ? "none" : "block";
    }
  }

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <header>
        <div className="nav">
          <div id="links">
            <Link to="/callback">Home</Link>
            <Link to="/about">About</Link>
            <a href="#logout" onClick={handleLogout}>
              Log Out
            </a>
          </div>

          <a className="icon" onClick={toggleOpen}>
            <IoMenu className="menu-icon" />
          </a>
        </div>
      </header>
    </>
  );
};

export default Nav;
