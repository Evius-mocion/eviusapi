import { NavigatorEnum } from "src/constants/constants";


export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validateEmail(password: string): boolean {
    return REGEX_EMAIL.test(password);
  }

export function validateNavigator(navigator: string): string {
    let browserName = 'Desconocido';
    const haveChrome = navigator.includes("Chrome");
    const haveFirefox = navigator.includes("Firefox");
    const haveSafari = navigator.includes("Safari");
    const haveEdg = navigator.includes("Edg");
    const haveOpera = navigator.includes("OPR");
    const havePostman = navigator.includes("PostmanRuntime");

    if (haveChrome && !haveEdg)  browserName = NavigatorEnum.chorme;
      
    if (haveFirefox)  browserName = NavigatorEnum.firefox;
    
    if (haveSafari) {
      // Safari también incluye "Chrome", así que verificamos que no sea Chrome
      if (!haveChrome) {
        browserName = NavigatorEnum.safari;
      }
    }

    if (haveEdg) browserName = NavigatorEnum.edge;

    if (haveOpera) browserName = NavigatorEnum.opera;

    if (havePostman) browserName = NavigatorEnum.postman;
    
    return browserName;
}