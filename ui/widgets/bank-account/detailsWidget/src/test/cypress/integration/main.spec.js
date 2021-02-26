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
      cy.get(detailsTitle).should('be.visible').should('have.text', "Details about 'Bank Account'");
      cy.get(entityIdCell).should('not.be.empty');
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
