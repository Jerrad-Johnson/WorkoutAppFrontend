import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Account from "./pages/Account";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Progress from "./pages/Progress";
import Management from "./pages/Management";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path={""} element={<Login />} />
                  <Route path={"Home"} element={<Home />} />
                  <Route path={"Account"} element={<Account/>} />
                  <Route path={"CreateAccount"} element={<CreateAccount/>} />
                  <Route path={"Progress"} element={<Progress/>} />
                  <Route path={"Management"} element={<Management/>} />
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
