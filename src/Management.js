import {logout} from "./utilities/queries";
let cc = console.log;

function Management(){
    return (
        <div>
            <button onClick={() => {
                handleLogout();
            }}>Log Out</button>
            <br />
            <button onClick={() => {

            }}>Get List of  Sessions</button>
            <br />
            <button onClick={() => {

            }}>Get List of Exercises</button>
            <br />

            <br />
            <button onClick={() => {

            }}>Change E-mail Address</button>
            <br />
            <button onClick={() => {

            }}>Change Password</button>

        </div>
    );
}

async function handleLogout(){
    await logout().then(data => cc(data));


}

export default Management