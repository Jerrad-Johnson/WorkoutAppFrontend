export interface formInterface {
    counter: number;
    notacounter: number;
    type: string;
    name: string;
}

export interface formActionInterface{
    type: string;
    payload?: number[];
}

export interface OptionsData{
    exercises: number;
    sets: number;
    reps: number;
    weights: number;
}

export interface OptionsAction{
    type: string;
    payload: any;
}