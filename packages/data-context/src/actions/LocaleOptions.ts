export type Locale = 'zh-Hans' | 'ja' | 'de' | 'es' | 'fr' | 'ko' | 'zh-Hant' | 'it' | 'en'

export type LOCALE_DATA_TYPE = {
  [key in Locale]: {language: string, localeJs: string}
}

export const SAMPLE_DATA = {
  'zh-Hans': {
    productName: '示例产品',
    copyright: '© 2022-2023 John Doe. 保留所有权利。',
  },
  'ja': {
    productName: 'サンプル製品',
    copyright: '© 2022-2023 John Doe. 全著作権所有。',
  },
  'de': {
    productName: 'Beispielprodukt',
    copyright: '© 2022-2023 John Doe. Alle Rechte vorbehalten.',
  },
  'es': {
    productName: 'Producto de ejemplo',
    copyright: '© 2022-2023 John Doe. Todos los derechos reservados.',
  },
  'fr': {
    productName: 'Produit d\'exemple',
    copyright: '© 2022-2023 John Doe. Tous droits réservés.',
  },
  'ko': {
    productName: '샘플 제품',
    copyright: '© 2022-2023 John Doe. 모든 권리 보유.',
  },
  'zh-Hant': {
    productName: '範例產品',
    copyright: '© 2022-2023 John Doe. 保留所有權利。',
  },
  'it': {
    productName: 'Prodotto di esempio',
    copyright: '© 2022-2023 John Doe. Tutti i diritti riservati.',
  },
  'en': {
    productName: 'Sample Product',
    copyright: '© 2022-2023 John Doe. All Rights Reserved.',
  },
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
