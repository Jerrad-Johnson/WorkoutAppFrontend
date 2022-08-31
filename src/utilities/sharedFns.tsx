import MenuItem from "@mui/material/MenuItem";
import React from "react";
import toast from "react-hot-toast";
import {successMessage} from "./sharedVariables";
import {StandardBackendResponse} from "./interfaces";
let cc = console.log;

export function arrayOfOptions(lengthOfArray: number) {
    return Array.from({length: lengthOfArray}).map((_e, k) => {
        return (
            <option key={k}>{k + 1}</option>
        );
    });
}

export function arrayOfMenuItems(lengthOfArray: number) {
    return Array.from({length: lengthOfArray}).map((_e, k) => {
        return (<MenuItem key={k} value={k+1}>{k+1}</MenuItem>);
    });
}

export function isUserValid(username: string){
    const usernameRegex = /^[a-z0-9_.]+$/
    const lowercaseUsername = username.toLowerCase();
    const isValid = usernameRegex.test(lowercaseUsername);

    if (username.length > 20){
        let msg: string = "Username may not be longer than 20 characters.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (!isValid){
        let msg: string = "Invalid username. Please use only letters, numbers, underscores, and periods.";
        toast.error(msg);
        throw new Error(msg);
    }
}

export function verifyEmailForm(newEmail: string, newEmailVerify: string){
    if (newEmail.length > 60){
        let msg: string = "E-mail address may not be longer than 60 characters.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (newEmail !== newEmailVerify) {
        let msg: string = "E-mail address must match in both fields.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (!String(newEmail).toLowerCase().match(                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        let msg: string = "Invalid e-mail address";
        toast.error(msg);
        throw new Error(msg);
    }
}

export function verifyPasswordChangeForms(oldPassword: string, newPassword: string, newPasswordVerify: string){
    if (newPassword.length > 255){
        let msg: string = "Password may not be longer than 255 characters.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (newPassword === "" || newPasswordVerify === ""){
        let msg: string = "New password must not be blank.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (newPassword !== newPasswordVerify) {
        let msg: string = "New passwords must match";
        toast.error(msg);
        throw new Error(msg);
    }
    if (oldPassword === ""){
        let msg: string = "Old password field must not be blank.";
        toast.error(msg);
        throw new Error(msg);
    }
}

export function verifyPasswordForms(newPassword: string, newPasswordVerify: string){
    if (newPassword === "" || newPasswordVerify === ""){
        let msg: string = "New password fields must not be blank.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (newPassword !== newPasswordVerify){
        let msg: string = "New passwords must match";
        toast.error(msg);
        throw new Error(msg);
    }
}

export function verifyPasswordFormsNewAccount(password: string, passwordVerify: string){
    if (password.length > 255){
        let msg: string = "Password may not be longer than 255 characters.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (password === "" || passwordVerify === ""){
        let msg: string = "Password fields must not be blank.";
        toast.error(msg);
        throw new Error(msg);
    }

    if (password !== passwordVerify){
        let msg: string = "Passwords must match";
        toast.error(msg);
        throw new Error(msg);
    }
}

export function showResponseMessageWithCondition(response: StandardBackendResponse){
    if (response && response.message !== successMessage){
        toast(response.message);
    }
}

export function showResponseMessageWithoutCondition(response: StandardBackendResponse){
        toast(response.message);
}

