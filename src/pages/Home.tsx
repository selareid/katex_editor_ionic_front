import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonPage, IonPopover, IonTitle, IonToggle, IonToolbar, ScrollDetail, SelectChangeEventDetail } from '@ionic/react';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import KatexInputField, {KatexInputFieldRefFrame} from '../components/KatexInputField';
import KatexOutputField from '../components/KatexOutputField';
import NoteSelectItem from '../components/NoteSelectItem';
import ServerAPI, { Status } from '../hooks/ServerAPI';
import useSyncManager from '../hooks/useSyncManager';
import './Home.css';

const UNSAVED_CHANGES_PROMPT = "Are you sure you want to leave — information you’ve entered may not be saved."

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
  const [inputFieldWidth, setInputFieldWidth] = useState<string>(); // also hides field when === "0"
  const [outputFieldWidth, setOutputFieldWidth] = useState<string>(); // also hides field when === "0"
  const [statusText, setStatusText] = useState("");
  const [slowModeEnabled, setSlowModeEnabled] = useState(false);
  const toggleSlowmode = () => setSlowModeEnabled(b => !b);

  const {localSyncCounter, incrementLocalSync, serverSyncedCount, setServerSyncCount, syncStatus, resetSyncStatus} = useSyncManager();

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
    resetSyncStatus();

    //used window.history.pushState because using history (prop) for history.push(<url>) made menu unable to open
    if (openNote) window.history.pushState({}, '', "/notes/" + openNote);
    else {
      window.history.pushState({}, '', "/");
      setStatusText("");
    }
  }, [openNote]);

  useEffect(() => {
    if (inputFieldRef.current) inputFieldRef.current.setInnerTextDontTriggerInput(rawKatexInput);
  }, [forceInputFieldTextRefreshCounter]);

  useEffect(() => { // sync server to local
    if (serverNoteAPI.note.data !== undefined && serverNoteAPI.note.data !== rawKatexInput) {
      setRawKatexInput(serverNoteAPI.note.data);
      forceInputFieldTextRefresh(n => n + 1);
      setStatusText("Attempted to download note");
    }
  }, [serverNoteAPI.note.data]);

  useEffect(() => {
    setStatusText(n => syncStatus?.syncText || n);
  }, [syncStatus]);

  useEffect(() => {
    window.onbeforeunload = !syncStatus || syncStatus.inSync ? null : () => true;
  }, [syncStatus]);

  useEffect(() => { // sync local to server
    if (!!serverNoteAPI.note.name && serverNoteAPI.note.data !== rawKatexInput) {
      serverNoteAPI.uploadNote(rawKatexInput, (status: Status, syncNumber) => {
        if (status.statusCode === 200) setServerSyncCount(syncNumber || NaN);
        else {
          setServerSyncCount(NaN);
          console.log(status.statusCode + "\n " + status.statusText);
        }
      }, localSyncCounter + 1);

      incrementLocalSync();
    }
  }, [rawKatexInput]);

  
  const handleContentScroll = (event: CustomEvent<ScrollDetail>) => {
    if (!outputFieldRef.current) return;

    let scroll = event.detail.scrollTop;
    let outputFieldTop = outputFieldRef.current.getBoundingClientRect().top;

    setScrollButtonDown(scroll < outputFieldTop);
    setOutputFieldTopPos(scroll + outputFieldTop);
  };

  //Note: this runs on note change also because note list selection gets changed when different note selected
  const handleNoteListSelectionChange = (event: CustomEvent<SelectChangeEventDetail<any>>) => {
    if (event.detail.value !== null && event.detail.value !== openNote && (!syncStatus || syncStatus.inSync || window.confirm(UNSAVED_CHANGES_PROMPT))) {
      setOpenNote(event.detail.value);
      menuRef.current!.close();
    }
  }

  const handleScrollFabClicked = () => {
    if (!scrollButtonDown) contentRef.current!.scrollToTop(750);
    else contentRef.current!.scrollToPoint(0, outputFieldTopPos - 70, 750);
  }

  const handleMacrosButtonClicked = (_event: React.MouseEvent<HTMLIonItemElement, MouseEvent>) => {
    setRawKatexInput(old => macros.data + '\n' + old);
    forceInputFieldTextRefresh(n => n + 1);
  }

  const handleIOFieldToggle = (_event: React.MouseEvent<HTMLIonItemElement, MouseEvent>) => {
    if (inputFieldWidth !== "0" && outputFieldWidth !== "0") { // set input only
      setInputFieldWidth("95vw");
      setOutputFieldWidth("0");
    }
    else if (inputFieldWidth !== "0") { // set output only
      setInputFieldWidth("0");
      setOutputFieldWidth("95vw");
    }
    else { // back to default
      setInputFieldWidth(undefined);
      setOutputFieldWidth(undefined);
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton menu="start"/>
          </IonButtons>    
          <IonTitle>{openNote ? openNote : "No Note Selected"}</IonTitle>
          <p className="headerStatusBox" slot='end'>{statusText}</p>
        </IonToolbar>
      </IonHeader>


      <IonMenu side="start" menuId="first" contentId='homeContent' ref={menuRef} onIonWillOpen={() => setMenuOpenCount(menuOpenCount+1)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Katex Editor</IonTitle>
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
                    if (!syncStatus || syncStatus.inSync || window.confirm(UNSAVED_CHANGES_PROMPT)) {
                      resetSyncStatus();
                      setOpenNote(newNoteInput);
                      menuRef.current!.close();
                      newNotePopoverRef.current!.dismiss();
                    }
                  }}>Create Note</IonButton>
                </IonContent>
              </IonPopover>
            </IonItem>
            <IonItem button={true} onClick={() => {
              if (!syncStatus || syncStatus.inSync || window.confirm(UNSAVED_CHANGES_PROMPT)) setOpenNote(null);
            }} >Local Note</IonItem>
            <IonItem button={true} onClick={handleMacrosButtonClicked}>Import Macros</IonItem>
            <IonItem button={true} onClick={handleIOFieldToggle}>Toggle Input/Output Fields</IonItem>
            <IonItem>
              <IonLabel>Slowmode</IonLabel>
              <IonToggle slot="end" color="secondary" checked={slowModeEnabled} onIonChange={() => toggleSlowmode()}/>
            </IonItem>
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
          {inputFieldWidth !== "0" ? <KatexInputField ref={inputFieldRef} width={inputFieldWidth} defaultInput={rawKatexInput} onInput={(event: React.FormEvent<HTMLPreElement>) => setRawKatexInput((event.target as HTMLElement).innerText)} /> : null}
          {outputFieldWidth !== "0" ? <KatexOutputField ref={outputFieldRef} width={outputFieldWidth} rawKatex={rawKatexInput} slowMode={slowModeEnabled}/> : null}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
