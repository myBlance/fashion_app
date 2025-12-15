import polyglotI18nProvider from 'ra-i18n-polyglot';
import vietnameseMessages from './vietnamese';

const i18nProvider = polyglotI18nProvider(
    () => vietnameseMessages,
    'vi', // Default locale
    { allowMissing: true }
);

export default i18nProvider;
