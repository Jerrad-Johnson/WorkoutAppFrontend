import {DefaultToastLoadingMessage} from "./interfaces";

export let successMessage: string = "Success";

export let defaultToastMsg: DefaultToastLoadingMessage  = {
    loading: 'Loading',
    success: 'Finished',
    error: (err: string) => `${err}`,
}