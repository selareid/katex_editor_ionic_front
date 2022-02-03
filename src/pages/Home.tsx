import { IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonPage, IonProgressBar, IonSplitPane, IonTitle, IonToolbar, ScrollDetail } from '@ionic/react';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import KatexInputField from '../components/KatexInputField';
import KatexOutputField from '../components/KatexOutputField';
import NoteSelect from '../components/NoteSelect';
import './Home.css';

const Home: React.FC = () => {
  const [rawKatexInput, setRawKatexInput] = useState("Initial Input\\\\[1em] UWU");
  const [scrollButtonDown, setScrollButtonDown] = useState(true);
  const [outputFieldTopPos, setOutputFieldTopPos] = useState(10000);

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const outputFieldRef = useRef(null);

  const handleContentScroll = (event: CustomEvent<ScrollDetail>) => {
    let scroll = event.detail.scrollTop;
    let outputFieldTop = (outputFieldRef.current! as HTMLElement).getBoundingClientRect().top;

    setScrollButtonDown(scroll < outputFieldTop);
    setOutputFieldTopPos(scroll + outputFieldTop);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton menu="start"/>
          </IonButtons>
          
          <IonTitle>Title</IonTitle>

          <IonProgressBar type="indeterminate"></IonProgressBar>
        </IonToolbar>
      </IonHeader>

      <IonMenu side="start" menuId="first" contentId='homeContent'>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Start Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>Menu Item</IonItem>
            <NoteSelect/>
            <IonItem>Menu Item</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonContent fullscreen id="homeContent" ref={contentRef} scrollEvents={true} onIonScroll={handleContentScroll}>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fabs">
          <IonFabButton> {/* Scroll up/down button (small screens)*/}
            <IonIcon icon={scrollButtonDown ? arrowDownOutline: arrowUpOutline} onClick={() => {
                if (!scrollButtonDown) contentRef.current!.scrollToTop(750);
                else contentRef.current!.scrollToPoint(0, outputFieldTopPos - 70, 750);
              }
            } />
          </IonFabButton>
        </IonFab>

        <div id='IOFlex'>
          <KatexInputField defaultInput={rawKatexInput} onInput={(event: React.FormEvent<HTMLPreElement>) => setRawKatexInput((event.target as HTMLElement).innerText)}/>
          <KatexOutputField ref={outputFieldRef} rawKatex={rawKatexInput}/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
