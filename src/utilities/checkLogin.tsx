import {queryCheckLogin} from "./queries";

let cc = console.log;

async function checkLogin(){
    let response = await queryCheckLogin();
    return response.data;
}

export default checkLogin