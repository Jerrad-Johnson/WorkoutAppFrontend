import {DefaultToastLoadingMessage} from "./interfaces";
export let defaultToastPromiseLoadingMessage: string = 'Loading';
export let defaultToastPromiseSuccessMessage: string = 'Loaded'; /*(msg: string) => string = (msg: string) => msg === `Success` ? "Loaded" : "Oops!";*/
export let defaultToastPromiseErrorMessage: (err: string) => string = (err: string) => `${err}`;
export let successMessage: string = "Success";
export let failedToLoad: string = "Failed to load. Try again.";

export let defaultToastMsg: DefaultToastLoadingMessage  = {
    loading: defaultToastPromiseLoadingMessage,
    success: defaultToastPromiseSuccessMessage,
    error: defaultToastPromiseErrorMessage,
}


