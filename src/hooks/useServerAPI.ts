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
  

export default function useServerAPI() {
    const [notesList, setNotesList] = useState<string[]>([]);
    const [notesListRefreshCount, setNotesListRefreshCount] = useState(0);

    useEffect(() => {
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

    }, [notesListRefreshCount]);

    const refreshNotesList = () => {
        setNotesListRefreshCount(notesListRefreshCount + 1);
    }

    return {notesList, refreshNotesList};
}