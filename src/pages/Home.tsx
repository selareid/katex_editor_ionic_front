import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonPage, IonProgressBar, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import KatexInputField from '../components/KatexInputField';
import KatexOutputField from '../components/KatexOutputField';
import './Home.css';

const Home: React.FC = () => {
  const [rawKatexInput, setRawKatexInput] = useState("Initial Input");

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
            <IonItem>Menu Item</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonContent fullscreen id="homeContent">
        <div id='IOFlex'>
          <KatexInputField defaultInput={rawKatexInput} onInput={(event: React.FormEvent<HTMLPreElement>) => setRawKatexInput((event.target as HTMLElement).innerText)}/>
          <KatexOutputField rawKatex={rawKatexInput}/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
