import { customElementName, detailsTitle, entityIdCell } from '../support';

describe('Main', () => {
beforeEach(() => {
  cy.getOauth2Data();
  cy.get('@oauth2Data').then(oauth2Data => {
    cy.keycloackLogin(oauth2Data, 'user');
  });
});

afterEach(() => {
  cy.get('@oauth2Data').then(oauth2Data => {
    cy.keycloackLogout(oauth2Data);
  });
  cy.clearCache();
});

  describe('Details widget', () => {
    it('should load the page', () => {
      cy.get(customElementName).should('exist');
    });

    it('should display the right values', () => {
      cy.get(detailsTitle).should('be.visible').should('have.text', "Details about 'Label'");
      cy.get(entityIdCell).should('not.be.empty');
      cy.contains('entities.label.labelName').should('be.visible');
    });
  });
});
