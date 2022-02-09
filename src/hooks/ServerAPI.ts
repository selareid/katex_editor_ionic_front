import { useEffect, useState } from "react";

const API_URI = "https://example.com/api/";

function useNotesList() {
    const [notesList, setNotesList] = useState<{status: Status, list: string[]}>({status: {statusCode: 200, statusText: "Initialised"}, list: []});

    useEffect(() => {
        refreshNotesList();
    }, []);

    const refreshNotesList = () => {
        fetch(API_URI + "notes_list")
        .then(res => {
            if (!res.ok) throw {statusCode: res.status, statusText: res.statusText};
            return res.text();
        })
        .then(
            (result) => {
                setNotesList({status: {statusCode: 200, statusText: "OK"}, list: result.split("\n")})
            },
            (error) => {
                setNotesList({status: {statusCode: error.statusCode, statusText: error.statusText}, list: []});
            }
        )
    }

    return {notesList, refreshNotesList};
}

interface Note {
    name: string | null,
    data?: string,
}

export interface Status {
    statusCode: number,
    statusText: string
}

function useServerNote(startingNoteName: string | null) {
    const [note, setNote] = useState<Note>({name: startingNoteName});

    useEffect(() => {
        if (note.name === null) setNote({name: null}) // reset data to undefined
        else downloadNote();
    }, [note.name]);

    const setNoteName = (noteName: string | null) => {
        setNote(n => ({...n, name: noteName}));
    }

    const downloadNote = () => {
        fetch(API_URI + "notes/" + note.name)
        .then(res => {
            if (!res.ok) throw {statusCode: res.status, statusText: res.statusText};
            return res.text();
        })
        .then(
            (result) => {
                setNote(n => ({name: n.name, data: result}));
            },
            (error) => {
                setNote(n => ({name: n.name, data: "\\text{Failed To Get Note},\n\\\\Wanted note : \\text{" + n.name+"}\n\\\\ Error: " + error}));
            }
        )
    };

    const uploadNote = (newNoteData: string, callback?: (status: Status) => void) => {
        setNote(n => ({...n, data: newNoteData}));

        fetch(API_URI + "notes/" + note.name, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: newNoteData,
        })
        .then(res => {
            if (!res.ok) throw {statusCode: res.status, statusText: res.statusText};
            return res.text();
        })
        .then(success => { if (callback) callback({statusCode: 200, statusText: success}); })
        .catch((error) => { if (callback) callback({statusCode: error.statusCode, statusText: error.statusText}); });
    }

    return {note, setNoteName, downloadNote, uploadNote};
}

const ServerAPI = {
    useNotesList,
    useServerNote
};

export default ServerAPI;