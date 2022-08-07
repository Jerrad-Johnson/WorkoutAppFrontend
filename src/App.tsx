import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import Home from "./views/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Management from "./views/Management";
import Nav from "./components/Nav";
import Login from "./views/Login";
import CreateAccount from "./views/CreateAccount";
import Progress from "./views/Progress";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path={"/"} element={<Login />} />
                  <Route path={"/Home"} element={<Home />} />
                  <Route path={"/Management"} element={<Management/>} />
                  <Route path={"/CreateAccount"} element={<CreateAccount/>} />
                  <Route path={"/Progress"} element={<Progress/>} />
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
