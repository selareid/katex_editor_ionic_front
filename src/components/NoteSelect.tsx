import { IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail } from "@ionic/react"
import { useState } from "react";
import { useServerNotesList } from "../hooks/useServerNotesList";


const NoteSelect: React.FC<{defaultValue?: string, onChange?: ((event: CustomEvent<SelectChangeEventDetail<any>>) => void)}> = (props) => {
    const notesList = useServerNotesList(['test1','test2','test3']);
    const [selectedNote, setSelectedNote] = useState(props.defaultValue);

    return <IonItem>
        <IonLabel>{"Note"}</IonLabel>
        <IonSelect style={{"--padding-start": "0px"}} interface="popover" value={selectedNote}
         onIonChange={(event) => {setSelectedNote(event.detail.value); if (props.onChange) {props.onChange(event);}}} >
            {
                notesList.map((noteName) => <IonSelectOption key={noteName} value={noteName}>{noteName}</IonSelectOption>)
            }
        </IonSelect>
    </IonItem>;
}

export default NoteSelect;