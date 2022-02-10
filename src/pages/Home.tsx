import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonPage, IonPopover, IonProgressBar, IonTitle, IonToolbar, ScrollDetail, SelectChangeEventDetail } from '@ionic/react';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import KatexInputField, {KatexInputFieldRefFrame} from '../components/KatexInputField';
import KatexOutputField from '../components/KatexOutputField';
import NoteSelectItem from '../components/NoteSelectItem';
import ServerAPI, { Status } from '../hooks/ServerAPI';
import './Home.css';

interface NoteNamePageProps
  extends RouteComponentProps<{
    noteName: string;
  }> {}

const Home: React.FC<NoteNamePageProps> = ({ match }) => {
  const urlNoteName: string | undefined = match.params.noteName;

  const [openNote, setOpenNote] = useState<string | null>(urlNoteName || null);
  const [rawKatexInput, setRawKatexInput] = useState("Initial Input\\\\[1em] UWU");
  const serverNoteAPI = ServerAPI.useServerNote(null);
  const [menuOpenCount, setMenuOpenCount] = useState(0); // for refreshing menu items when opened (such as notes list)
  const [scrollButtonDown, setScrollButtonDown] = useState(true); // scroll button direction
  const [outputFieldTopPos, setOutputFieldTopPos] = useState(window.innerHeight);
  const [newNoteInput, setNewNoteInput] = useState<string>("");
  const {macros, refreshMacros} = ServerAPI.useMacros();
  const [forceInputFieldTextRefreshCounter, forceInputFieldTextRefresh] = useState(0);

  const menuRef = useRef<HTMLIonMenuElement>(null);
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const inputFieldRef = useRef<KatexInputFieldRefFrame>(null);
  const outputFieldRef = useRef<HTMLElement>(null);
  const newNoteInputFieldRef = useRef<HTMLIonInputElement>(null);
  const newNotePopoverRef = useRef<HTMLIonPopoverElement>(null);

  useEffect(() => {
    refreshMacros();
  }, []);

  useEffect(() => {
    serverNoteAPI.setNoteName(openNote);
  }, [openNote]);

  useEffect(() => {
    inputFieldRef.current!.setInnerTextDontTriggerInput(rawKatexInput);
  }, [forceInputFieldTextRefreshCounter]);

  useEffect(() => { // sync server to local
    if (serverNoteAPI.note.data !== undefined && serverNoteAPI.note.data !== rawKatexInput) {
      setRawKatexInput(serverNoteAPI.note.data);
      forceInputFieldTextRefresh(n => n + 1);
    }
  }, [serverNoteAPI.note.data]);

  useEffect(() => { // sync local to server
    if (!!serverNoteAPI.note.name && serverNoteAPI.note.data !== rawKatexInput) {
      console.log("Attempting note upload to note " + serverNoteAPI.note.name);
      serverNoteAPI.uploadNote(rawKatexInput, (status: Status) => {
        console.log("Attempted note uploading to note " + serverNoteAPI.note.name + "\nGot status code: " + status.statusCode + "\nWith text: " + status.statusText);
      });
    }
  }, [rawKatexInput]);


  
  const handleContentScroll = (event: CustomEvent<ScrollDetail>) => {
    let scroll = event.detail.scrollTop;
    let outputFieldTop = outputFieldRef.current!.getBoundingClientRect().top;

    setScrollButtonDown(scroll < outputFieldTop);
    setOutputFieldTopPos(scroll + outputFieldTop);
  };

  //Note: this runs on note change also because note list selection gets changed when different note selected
  const handleNoteListSelectionChange = (event: CustomEvent<SelectChangeEventDetail<any>>) => {
    setOpenNote(event.detail.value);
    menuRef.current!.close();
    if (event.detail.value) window.history.pushState({}, '', "/notes/" + event.detail.value); //used window.history.pushState because using history (prop) for history.push(<url>) made menu unable to open
  }

  const handleScrollFabClicked = () => {
    if (!scrollButtonDown) contentRef.current!.scrollToTop(750);
    else contentRef.current!.scrollToPoint(0, outputFieldTopPos - 70, 750);
  }

  const handleMacrosButtonClicked = (_event: React.MouseEvent<HTMLIonItemElement, MouseEvent>) => {
    setRawKatexInput(old => macros.data + '\n' + old);
    forceInputFieldTextRefresh(n => n + 1);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton menu="start"/>
          </IonButtons>    
          <IonTitle>{openNote ? openNote : "No Note Selected"}</IonTitle>
          <IonProgressBar type="indeterminate"></IonProgressBar>
        </IonToolbar>
      </IonHeader>


      <IonMenu side="start" menuId="first" contentId='homeContent' ref={menuRef} onIonWillOpen={() => setMenuOpenCount(menuOpenCount+1)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Start Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <NoteSelectItem selectedNote={openNote} onChange={handleNoteListSelectionChange} listRefreshConditions={[menuOpenCount]} />
            <IonItem button={true} id="newNoteButton">
              <IonLabel>New Note</IonLabel>
              <IonPopover ref={newNotePopoverRef} trigger="newNoteButton" reference="event" onIonPopoverDidPresent={() => newNoteInputFieldRef.current!.getInputElement().then(result => result.focus())}>
                <IonContent>
                  <IonInput ref={newNoteInputFieldRef} placeholder="Note Name" onIonChange={e => setNewNoteInput(e.detail.value || "")}/>
                  <IonButton color='tertiary' onClick={_e => {
                    setOpenNote(newNoteInput);
                    menuRef.current!.close();
                    newNotePopoverRef.current!.dismiss();
                    window.history.pushState({}, '', "/notes/" + newNoteInput);
                  }}>Create Note</IonButton>
                </IonContent>
              </IonPopover>
            </IonItem>
            <IonItem button={true} onClick={() => {
              setOpenNote(null);
              window.history.pushState({}, '', "/");
            }} >Local Note</IonItem>
            <IonItem button={true} onClick={handleMacrosButtonClicked}>Import Macros</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>


      <IonContent fullscreen id="homeContent" ref={contentRef} scrollEvents={true} onIonScroll={handleContentScroll}>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fabs">
          <IonFabButton onClick={handleScrollFabClicked}> {/* Scroll up/down button (small screens)*/}
            <IonIcon icon={scrollButtonDown ? arrowDownOutline: arrowUpOutline} />
          </IonFabButton>
        </IonFab>

        <div id='IOFlex'>
          <KatexInputField ref={inputFieldRef} defaultInput={rawKatexInput} onInput={(event: React.FormEvent<HTMLPreElement>) => setRawKatexInput((event.target as HTMLElement).innerText)}/>
          <KatexOutputField ref={outputFieldRef} rawKatex={rawKatexInput}/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
