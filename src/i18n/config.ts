import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ptBR from './locales/pt-BR.json';
import da from './locales/da.json';
import sv from './locales/sv.json';
import fi from './locales/fi.json';
import cs from './locales/cs.json';
import sk from './locales/sk.json';
import nl from './locales/nl.json';
import hu from './locales/hu.json';
import uk from './locales/uk.json';
import sr from './locales/sr.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import tr from './locales/tr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
      pt: { translation: pt },
      'pt-BR': { translation: ptBR },
      da: { translation: da },
      sv: { translation: sv },
      fi: { translation: fi },
      cs: { translation: cs },
      sk: { translation: sk },
      nl: { translation: nl },
      hu: { translation: hu },
      uk: { translation: uk },
      sr: { translation: sr },
      th: { translation: th },
      vi: { translation: vi },
      hi: { translation: hi },
      ja: { translation: ja },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      tr: { translation: tr },
    },
    fallbackLng: 'en',
    supportedLngs: [
      'en',
      'ru',
      'de',
      'es',
      'fr',
      'it',
      'pt',
      'pt-BR',
      'da',
      'sv',
      'fi',
      'cs',
      'sk',
      'nl',
      'hu',
      'uk',
      'sr',
      'th',
      'vi',
      'hi',
      'ja',
      'zh-CN',
      'zh-TW',
      'tr',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
