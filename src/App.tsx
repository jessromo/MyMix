import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Home";
//import Callback from "./components/Callback";
import Login from "./components/Login";
import Mix from "./components/Mix";
import Plop from "./components/test";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Login />} />
          <Route path="/callback" element={< Plop/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
