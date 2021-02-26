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
        cy.contains('entities.bankAccount.name').should('be.visible');
        cy.contains('entities.bankAccount.bankNumber').should('be.visible');
        cy.contains('entities.bankAccount.agencyNumber').should('be.visible');
        cy.contains('entities.bankAccount.lastOperationDuration').should('be.visible');
        cy.contains('entities.bankAccount.meanOperationDuration').should('be.visible');
        cy.contains('entities.bankAccount.balance').should('be.visible');
        cy.contains('entities.bankAccount.openingDay').should('be.visible');
        cy.contains('entities.bankAccount.lastOperationDate').should('be.visible');
        cy.contains('entities.bankAccount.active').should('be.visible');
        cy.contains('entities.bankAccount.accountType').should('be.visible');
        cy.contains('entities.bankAccount.attachment').should('be.visible');
        cy.contains('entities.bankAccount.description').should('be.visible');
    });
  });
});
