import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import UserAccount from "./pages/UserAccount";
import { Navbar } from "./components/Navbar";
import Selection from "./pages/Selection";
import "./App.css";

function App() {
  const location = useLocation();

  // Define an array of paths where you want to show the Navbar
  const navPaths = ["/Quiz", "/Selection", "/UserAccount"];

  // Check if the current path is one of the paths in navPaths
  const showNavbar = navPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className="App">
         <Navbar /> 
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/CreateAccount" element={<CreateAccount/>}/>
          <Route path="/Quiz/:user_id" element={<Quiz />} />
          <Route path="/UserAccount/:user_id" element={<UserAccount/>}/>
          <Route path="/Selection/:user_id/:selection_id" element={<Selection/>}/>
        </Routes>
    </div>
  );
}

export default App;
