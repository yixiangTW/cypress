import type { CodeLanguage } from '@packages/types'
import dedent from 'dedent'

const COMMAND_TYPES = dedent`
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
`

export function commandsFileBody (language: CodeLanguage['type'], supportMultiLanguage: boolean) {
  return dedent`
    ${language === 'ts' ? '/// <reference types="cypress" />' : ''}
    // ***********************************************
    // This example commands.${language} shows you how to
    // create various custom commands and overwrite
    // existing commands.
    //
    // For more comprehensive examples of custom
    // commands please read more here:
    // https://on.cypress.io/custom-commands
    // ***********************************************
    //
    //
    // -- This is a parent command --
    // Cypress.Commands.add('login', (email, password) => { ... })
    //
    //
    // -- This is a child command --
    // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
    //
    //
    // -- This is a dual command --
    // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
    //
    //
    // -- This will overwrite an existing command --
    // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
    // -- This is g11n verification --
    ${supportMultiLanguage ? `Cypress.Commands.add('getLocal', () => {
      if (Cypress.config('isInteractive')) {
        const urlParams = new URLSearchParams(window.top.location.hash);
        return urlParams.get('locale')
      } else {
        return Cypress.env('locale')
      }
    })` : ''}


    ${language === 'ts' ? COMMAND_TYPES : ''}
  `
}
