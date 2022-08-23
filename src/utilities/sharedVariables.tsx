import {DefaultToastLoadingMessage} from "./interfaces";

export let successMessage: string = "Success";

export let defaultToastMsg: DefaultToastLoadingMessage  = {
    loading: 'Loading',
    success: 'Success',
    error: (err: string) => `${err}`,
}