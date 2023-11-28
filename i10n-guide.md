# Getting Started

### Initialize

Config I10n.config.json

```json
{
  "initLocales": [],
  "initLocaleOptions": [
    {
      "locale": "zh-Hans",
      "language": "简体中文"
    },
    {
      "locale": "ja",
      "language": "日本語"
    },
    {
      "locale": "abc",
      "language": "谁也看不懂语"
    }
  ]
}
```

initLocaleOptions: Configure all supported language options for the project   
initLocales: Configure the language resources that need to be generated

Then:
- `yarn run dev` (development)
- `npx cypress open` (production)




### Automatically generated new directory
Cypress will create modules related to multilingual features in your project.
- `cypress.config.js`
Environment variables related to multilingual support will be generated.
the locale parameter defaults to the first item in initLocales
```javascript
env: {
  locale: "zh-Hans",
  superString: "あア１ａ中鷗屢简ÖÜß體₩겨ㅊĐứсηñçüÜÓÇÁÑ¿¡n°€",
}
```

- `cypress/common-message/*.json`
Common translation, eg: zh-Hans.json, abc.json
```json
{
  "locale": "zh-Hans",
  "language": "简体中文"
}
```
- `cypress/common-message/SampleProduct/1.0.0/SampleComponet/*.json`
Special translation Sample, according to your needs, you can create this directory yourself. The directory structure should follow /productName/version/featureName/xxx.json format. Currently, only JSON files are supported
```json
{
  "productName": "productName",
  "copyright": "© 2022-2023 copyright"
}
```


- `cypress/i10n`
Provides methods to load translation resources
```javascript
export const L10n = {
  commonMsg: (locale) => {
    const _SOURCE = require(`../common-messages/${locale}.json`);
    return (key) => L10n.findValue(_SOURCE, key);
  },
  specialMsg: (product, version, component, locale) => {
    const _SOURCE = require(`../common-messages/${product}/${version}/${component}/${locale}.json`);
    return (key) => L10n.findValue(_SOURCE, key);
  },
  findValue: (source, key) => {
    if (source.hasOwnProperty(key)) {
      return source[key];
    }

    for (const prop in source) {
      if (typeof source[prop] === 'object') {
        const result = L10n.findValue(source[prop], key);
        if (result !== undefined) {
          return result;
        }
      }
    }

    return key;
  }
};

```
Here is an example of usage
```javascript
const t = commonMsg('zh-Hans')
cy.wrap(t('language')).should('eq', '简体中文')

// These three parameters represent the three-tier directory structure corresponding to the special translation file
const t = specialMsg('SampleProduct', '1.0.0', 'SampleComponet', 'en') 
cy.wrap(t('productName')).should('eq', 'productName')
```


- `run.sh`
An example that shows you how to run Cypress in different languages using the command line.
```
npx cypress run --env locale=zh-Hans
```


- `run.bat`
An example that shows you how to run Cypress in different languages using the command line.

- `cypress/support/commands.js`
Created a global method to get the current locale
```javascript
Cypress.Commands.add('getLocal', () => {
  if (Cypress.config('isInteractive')) {
    const urlParams = new URLSearchParams(window.top.location.hash);
    return urlParams.get('locale')
  } else {
    return Cypress.env('locale')
  }
})
```


### Write Test

This is a complete demo showing how to perform multilingual testing
```javascript
// spec.cy.js
import { L10n } from '../i10n'

const languageDropDown = {
  self: '[aria-label="language"]',
  languageMenu: `.dropdown-menu`
}

const verifyLocale = (locale) => {
  if (locale) {
    cy.log(`Curren locale is：${locale}`);
    const t = L10n.commonMsg(locale)
    // const t = L10n.specialMsg('SampleProduct', '1.0.0', 'SampleComponent', locale)
    const url = 'https://console-stg.cloud.vmware.com/csp/gateway/discovery'
    cy.visit({ url, headers: { 'Accept-Language': t('localeJs') }} )
    changeLoginUiLanguageInPasswordPage(t('language'))

  } else {
    cy.log('Not found');
  }
}

const changeLoginUiLanguageInPasswordPage = (language) => {
  cy.get(languageDropDown.self).should('be.visible').click()
  cy.get(languageDropDown.languageMenu).contains(language).click()
}

describe('template spec', () => {
  it('passes', () => {
    cy.getLocal().then(verifyLocale)
  })
})

```



### Run:

##### run mode

- `yarn cypress:run --project /Users/yixiang/learnCypress/demo --env locale=zh-Hans` (development)
- `npx cypress run --env locale=zh-Hans` (production)


##### open mode

- `npx cypress open`


### Exclude new features
Ensure that initLocaleOptions is empty, for example, do not create the i10n.config.json file, or do not set the initLocaleOptions parameter