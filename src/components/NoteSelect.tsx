import { IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail } from "@ionic/react"
import { useEffect, useState } from "react";
import useServerAPI from "../hooks/useServerAPI";


const NoteSelect: React.FC<{defaultValue?: string, onChange?: ((event: CustomEvent<SelectChangeEventDetail<any>>) => void), listRefreshConditions?: any[]}> = (props) => {
    const { notesList, refreshNotesList } = useServerAPI();
    const [selectedNote, setSelectedNote] = useState(props.defaultValue);

    useEffect(() => refreshNotesList(), (props.listRefreshConditions === undefined ? [] : props.listRefreshConditions));

    return <IonItem>
        <IonLabel>{"Note"}</IonLabel>
        <IonSelect style={{"--padding-start": "0px"}} interface="popover" value={selectedNote}
         onIonChange={(event) => {setSelectedNote(event.detail.value); if (props.onChange) {props.onChange(event);}}}>
            {
                notesList.map((noteName) => <IonSelectOption key={noteName} value={noteName}>{noteName}</IonSelectOption>)
            }
        </IonSelect>
    </IonItem>;
}

export default NoteSelect;