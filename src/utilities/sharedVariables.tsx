import {DefaultToastLoadingMessage} from "./interfaces";
export let defaultToastPromiseLoadingMessage: string = 'Loading';
export let defaultToastPromiseSuccessMessage: string = 'Finished';
export let defaultToastPromiseErrorMessage: (err: string) => string = (err: string) => `${err}`;
export let successMessage: string = "Success";

export let defaultToastMsg: DefaultToastLoadingMessage  = {
    loading: defaultToastPromiseLoadingMessage,
    success: defaultToastPromiseSuccessMessage,
    error: defaultToastPromiseErrorMessage,
}


