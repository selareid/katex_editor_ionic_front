import { IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail } from "@ionic/react"
import { useEffect, useState } from "react";
import ServerAPI from "../hooks/ServerAPI";


const NoteSelectItem: React.FC<{selectedNote: string | null, onChange: ((event: CustomEvent<SelectChangeEventDetail<any>>) => void), listRefreshConditions?: any[]}> = (props) => {
    const { notesList, refreshNotesList } = ServerAPI.useNotesList();

    useEffect(() => refreshNotesList(), (props.listRefreshConditions === undefined ? [] : props.listRefreshConditions));

    return <IonItem>
        <IonLabel>{"Note"}</IonLabel>
        <IonSelect value={props.selectedNote} onIonChange={props.onChange} style={{"--padding-start": "0px"}} interface="popover" > {
                notesList.list.map((noteName) => <IonSelectOption key={noteName} value={noteName}>{noteName}</IonSelectOption>)
            } </IonSelect>
    </IonItem>;
}

export default NoteSelectItem;