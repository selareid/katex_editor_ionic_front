import { IonItem } from "@ionic/react";


const KatexPrinterItem: React.FC = () => {
    return <IonItem button={true} onClick={() => {
        try {
          var x = window.open();

          x!.document.open('/', '_blank').write(`
              <!DOCTYPE html>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.css" integrity="sha384-A3N+UgNMKg9+LRsC2HUE0ECxFY7qhztVFORxHQZEPm7lnog2poqmm7CQ91wSEnBc" crossorigin="anonymous">
              <style>
                  * { color: black; }
          
                  html { background-color: rgb(148, 127, 114); }
      
                  body {
                      width:210mm;
                      margin: 0;
                  }
      
                  #widthWrap {
                      background-color: white;
                  }
      
                  #outputBox {
                      width: 100%;
                      margin: 0;
                      padding-top: 1em;
                  }
      
                  @media print {
                      html {
                          background-color: white;
                      }
                  }
              </style>
              <body>
                <div id="widthWrap">
                  <div id="outputBox">
                    ${document.getElementsByClassName("katexOutputElement")[0].outerHTML}
                  </div>
                </div>
              </body>
            `);
        }
        catch (e) {
          console.error(e);
        }
      }
    } >Print</IonItem>
}

export default KatexPrinterItem;