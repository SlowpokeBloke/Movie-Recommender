import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import UserAccount from "./pages/UserAccount";
import { Navbar } from "./components/Navbar";
import "./App.css"

function App() {
  return (
    <div className="App">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/CreateAccount" element={<CreateAccount/>}/>
          <Route path="/Quiz" element={<Quiz/>}/>
          <Route path="/UserAccount" element={<UserAccount/>}/>
        </Routes>
    </div>
  );
}

export default App;
