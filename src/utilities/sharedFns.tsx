import MenuItem from "@mui/material/MenuItem";
import React from "react";

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

export function verifyEmailForm(newEmail: string, newEmailVerify: string){
    if (newEmail !== newEmailVerify) throw new Error("E-mail address must match in both fields.");
    if (!String(newEmail).toLowerCase().match(                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        throw new Error("Invalid e-mail address");
    }
}

export function verifyPasswordChangeForms(oldPassword: string, newPassword: string, newPasswordVerify: string){
    if (newPassword === "" || newPasswordVerify === "") throw new Error("New password must not be blank.");
    if (newPassword !== newPasswordVerify) throw new Error("New passwords must match");
    if (oldPassword === "") throw new Error("Old password field must not be blank.");
}

export function verifyPasswordForms(newPassword: string, newPasswordVerify: string){
    if (newPassword === "" || newPasswordVerify === "") throw new Error("New password must not be blank.");
    if (newPassword !== newPasswordVerify) throw new Error("New passwords must match");
}