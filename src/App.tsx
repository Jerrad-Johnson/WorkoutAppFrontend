import React from 'react';
import './styles/App.css';
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Account from "./pages/Account";
import Login from "./pages/Login";
import LoginRecruiter from "./pages/LoginRecruiter";
import Progress from "./pages/Progress";
import Management from "./pages/Management";
import CreateAccount from "./pages/CreateAccount";
import {Toaster} from "react-hot-toast";
import PasswordReset from "./pages/PasswordReset";
import ResetCheck from "./pages/ResetCheck";

let cc = console.log;

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path={""} element={<Login />} />
                  <Route path={"/LoginRecruiter"} element={<LoginRecruiter />} />
                  <Route path={"Home"} element={<Home />} />
                  <Route path={"Account"} element={<Account/>} />
                  <Route path={"CreateAccount"} element={<CreateAccount/>} />
                  <Route path={"Progress"} element={<Progress/>} />
                  <Route path={"Management"} element={<Management/>} />
                  <Route path={"PasswordReset"} element={<PasswordReset/>} />
                  <Route path={"ResetCheck"} element={<ResetCheck/>} />
              </Routes>
          </BrowserRouter>
      </header>
        <Toaster
            position="bottom-center"
            containerClassName={"toastContainer"}
            toastOptions={{
                className: '',
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                }}}
        />
    </div>

  );
}

export default App;
