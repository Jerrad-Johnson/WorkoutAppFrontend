import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Management from "./pages/Management";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Progress from "./pages/Progress";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path={""} element={<Login />} />
                  <Route path={"Home"} element={<Home />} />
                  <Route path={"Management"} element={<Management/>} />
                  <Route path={"CreateAccount"} element={<CreateAccount/>} />
                  <Route path={"Progress"} element={<Progress/>} />
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
