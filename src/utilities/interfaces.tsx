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
    exerciseSelectorOrInput: number[];
    selectedSessionToLoad: string | undefined;
    staticExerciseNames: string[] | undefined;
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

export interface SessionEntry {
    date: string;
    title: string;
    reps: number[][];
    weights: number[][];
    exercises: string[];
    notes: string;
}

export interface StandardBackendResponse {
    message: string;
    data: any;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface HandleActionsData{
    confirmationBox: boolean;
    functionToPerform: () => Promise<void> | undefined;
    changePassword: boolean;
    changeEmail: boolean;
}

export interface SessionToDelete{
    title: string;
    date: string;
}

export interface SessionDateHashmap{
    [key: string]: number;
}

export interface HeatmapByDate{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface FormattedSesssionHeatmapData extends Array<HeatmapByDate>{};

export interface NotesDateAndTitle{
    session_date: string;
    session_title: string;
    id: number;
}

export interface NotesDateAndTitleArray extends Array<NotesDateAndTitle>{};

export interface DefaultToastLoadingMessage{
    loading: string;
    success: string;
    error: (err: string) => string;
}