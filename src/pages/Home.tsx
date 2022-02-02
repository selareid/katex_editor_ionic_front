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
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      
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
