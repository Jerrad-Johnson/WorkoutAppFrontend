import {queryCheckLogin} from "./queries";

let cc = console.log;

async function checkLogin(){
    let response = await queryCheckLogin();
    return response;
}

export default checkLogin