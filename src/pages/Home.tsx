import { IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonPage, IonProgressBar, IonTitle, IonToolbar, ScrollDetail, SelectChangeEventDetail } from '@ionic/react';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import KatexInputField, {KatexInputFieldRefFrame} from '../components/KatexInputField';
import KatexOutputField from '../components/KatexOutputField';
import NoteSelect from '../components/NoteSelect';
import ServerAPI from '../hooks/ServerAPI';
import './Home.css';

const Home: React.FC = () => {
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [rawKatexInput, setRawKatexInput] = useState("Initial Input\\\\[1em] UWU");
  const serverNoteAPI = ServerAPI.useServerNote(null);
  const [menuOpenCount, setMenuOpenCount] = useState(0); // for refreshing menu items when opened (such as notes list)
  const [scrollButtonDown, setScrollButtonDown] = useState(true); // scroll button direction
  const [outputFieldTopPos, setOutputFieldTopPos] = useState(window.innerHeight);

  const menuRef = useRef<HTMLIonMenuElement>(null);
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const inputFieldRef = useRef<KatexInputFieldRefFrame>(null);
  const outputFieldRef = useRef<HTMLElement>(null);

  useEffect(() => {
    serverNoteAPI.setNoteName(openNote);
  }, [openNote]);

  useEffect(() => {
    if (!!serverNoteAPI.note.data && serverNoteAPI.note.data !== rawKatexInput) { // let's not override local input with empty
      inputFieldRef.current!.setInnerTextDontTriggerInput(serverNoteAPI.note.data);
      setRawKatexInput(serverNoteAPI.note.data);
    }
  }, [serverNoteAPI.note.data]);


  
  const handleContentScroll = (event: CustomEvent<ScrollDetail>) => {
    let scroll = event.detail.scrollTop;
    let outputFieldTop = outputFieldRef.current!.getBoundingClientRect().top;

    setScrollButtonDown(scroll < outputFieldTop);
    setOutputFieldTopPos(scroll + outputFieldTop);
  };

  const handleNoteSelectedFromList = (event: CustomEvent<SelectChangeEventDetail<any>>) => {
    setOpenNote(event.detail.value);
    menuRef.current!.close()
  }

  const handleScrollFabClicked = () => {
    if (!scrollButtonDown) contentRef.current!.scrollToTop(750);
    else contentRef.current!.scrollToPoint(0, outputFieldTopPos - 70, 750);
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
            <IonItem>Menu Item</IonItem>
            <NoteSelect listRefreshConditions={[menuOpenCount]} onChange={handleNoteSelectedFromList}/>
            <IonItem>Menu Item</IonItem>
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
