export type Locale = 'zh-Hans' | 'ja' | 'de' | 'es' | 'fr' | 'ko' | 'zh-Hant' | 'it' | 'en'

export type LOCALE_DATA_TYPE = {
  [key in Locale]: {language: string, localeJs: string}
}

export const LOCALE_DATA: LOCALE_DATA_TYPE = {
  'zh-Hans': {
    language: '简体中文',
    localeJs: 'zh-cn',
  },
  'ja': {
    language: '日本語',
    localeJs: 'ja',
  },
  'de': {
    language: 'Deutsch',
    localeJs: 'de',
  },
  'es': {
    language: 'Español',
    localeJs: 'es',
  },
  'fr': {
    language: 'Français',
    localeJs: 'fr',
  },
  'ko': {
    language: '한국어',
    localeJs: 'ko',
  },
  'zh-Hant': {
    language: '繁體中文',
    localeJs: 'zh-tw',
  },
  'it': {
    language: 'Italiano',
    localeJs: 'it',
  },
  'en': {
    language: 'English',
    localeJs: 'en-us',
  },
}
