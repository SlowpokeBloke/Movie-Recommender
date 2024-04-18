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
 
  return (
    <div className="App"> 
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<><Navbar /><Login/></>}/>
          <Route path="/CreateAccount" element={<><Navbar /><CreateAccount/></>}/>
          <Route path="/Quiz/:user_id" element={<><Navbar /><Quiz /></>} />
          <Route path="/UserAccount/:user_id" element={<><Navbar /><UserAccount/></>}/>
          <Route path="/Selection/:user_id/:selection_id" element={<><Navbar /><Selection/></>}/>
        </Routes>
    </div>
  );
}

export default App;
