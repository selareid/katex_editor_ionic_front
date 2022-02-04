import { useEffect, useState } from "react";

const API_URI = "https://example.com/";

function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

function useNotesList() {
    const [notesList, setNotesList] = useState<string[]>([]);

    useEffect(() => {
        refreshNotesList();
    }, []);

    const refreshNotesList = () => {
        fetch(API_URI + "notes_list")
        .then(res => res.json())
        .then(
            (result) => {
                setNotesList(result)
            },
            (error) => {
                setNotesList(shuffle(["1FAKE", "2TRASH", "3TEST", "4THIS"]));
                console.log(error);
            }
        )
    }

    return {notesList, refreshNotesList};
}

interface Note {
    name: string | null,
    data?: string,
}

interface Status {
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
        //TODO add the server pulling
        //handle failure somehow O.o

        setNote(n => ({name: n.name, data: "some downloaded stuff FAKE REPLACE SOON, wanted note " + n.name}));
    };

    const uploadNote = (newNoteData: string, callback: (status: Status) => void) => {
        //TODO send note to server

        setNote(n => ({...n, data: newNoteData}));

        //return a status
    }

    return {note, setNoteName, downloadNote, uploadNote};
}

const ServerAPI = {
    useNotesList,
    useServerNote
};

export default ServerAPI;