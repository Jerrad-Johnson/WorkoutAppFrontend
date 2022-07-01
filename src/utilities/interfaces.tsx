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

export interface GenericAction{
    type: string;
    payload: any;
}

export interface SessionData{
    title: string;
    date: string;
    exerciseCount: number[];
    exerciseNames: string[] | undefined;
    sets: number[];
    reps: number[][];
    weights: number[][];
    notes: string | undefined;
}

export interface submissionData {
    title?: string | null;
    date?: string | null;
    exercises?: string[] | null[];
    reps?: number[][] | null;
    weights?: number[][] | null
}

export interface specificSessionOutput {
    date: string;
    title: string;
}