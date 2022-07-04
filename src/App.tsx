import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from "./Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Management from "./Management";
import Nav from "./Nav";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Nav />
              <Routes>
                  <Route path={"/"} element={<Home />} />
                  <Route path={"/Management"} element={<Management/>} />
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
