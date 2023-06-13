/**
 * Basic Setting Variables Define
 */
export const BaseSetting = {
    name: 'restwell',
    displayName: 'Restwell',
    appVersion: '1.0.0',
    domain: 'restwell.az',
    protocol: 'http',
    defaultLanguage: 'az',
    defaultDesign: 'basic',
    languageSupport: [
      'en',
      'az',
      'ar',
      'ru',
      'tr',
    ],
    resourcesLanguage: {
      en: {
        translation: require('../lang/en.json'),
      },
      az: {
        translation: require('../lang/az.json'),
      },
      ar: {
        translation: require('../lang/ar.json'),
      },
      ru: {
        translation: require('../lang/ru.json'),
      },
      tr: {
        translation: require('../lang/tr.json'),
      }
    },
  };