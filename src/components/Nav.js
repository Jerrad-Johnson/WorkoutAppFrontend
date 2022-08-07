import {Link} from "react-router-dom";

function Nav(){
    return (
        <div>
            <Link to={"/Home"}>Home</Link> &nbsp;
            <Link to={"/Management"}>Account Management</Link> &nbsp;
            <Link to={"/Progress"}>View Progress</Link>
        </div>
    );
}

export default Nav;