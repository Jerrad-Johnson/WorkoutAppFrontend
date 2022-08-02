import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from "./Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Management from "./Management";
import Nav from "./Nav";
import Login from "./Login";
import CreateAccount from "./CreateAccount";

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
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
