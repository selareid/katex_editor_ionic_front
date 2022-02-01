import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useRef, useState } from 'react';
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
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <KatexInputField defaultInput={rawKatexInput} onInput={(event: React.FormEvent<HTMLPreElement>) => setRawKatexInput((event.target as HTMLElement).innerText)}/>
        <KatexOutputField rawKatex={rawKatexInput}/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
