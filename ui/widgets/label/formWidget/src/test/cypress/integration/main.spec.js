import { customElementName } from '../support';

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

  describe('Form widget', () => {
    it('should load the page', () => {
      cy.get(customElementName).should('exist');
    });

    it('should display all the entity fields in the component', () => {
        cy.contains('entities.label.labelName').should('be.visible');
    });
  });
});
