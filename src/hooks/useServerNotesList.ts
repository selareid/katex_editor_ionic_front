import { useState } from "react";

export function useServerNotesList(initalState: string[] = []) {
    const [notesList, setNotesList] = useState(initalState);

    

    return notesList;
}