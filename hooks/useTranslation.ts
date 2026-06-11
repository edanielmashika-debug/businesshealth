import { useLanguageStore} from "../store/language-store";
import { translations } from "../lib/tranlations";

export function useTranslation(){
    const language = 
      useLanguageStore(
        (state)=> state.language
      );

      return translations[language];
}