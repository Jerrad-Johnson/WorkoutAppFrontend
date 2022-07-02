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
    exerciseNames: string[];
    sets: number[];
    reps: number[][];
    weights: number[][];
    notes: string | undefined;
    previousSessions: {sessionDate: string, session_title: string}[] | undefined;

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

export interface DatabaseData{
    previousSessions: {
        session_date: string | undefined,
        session_title: string | undefined,
    }[];
    exercises: string[];
    loadPrevSessionsNow: boolean;
    loadExerciseListNow: true;
}