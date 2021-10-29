import { customElementName } from '../support';

describe('Main', () => {
  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then((oauth2Data) => {
      cy.keycloackLogin(oauth2Data, 'user');
    });
  });

  afterEach(() => {
    cy.get('@oauth2Data').then((oauth2Data) => {
      cy.keycloackLogout(oauth2Data);
    });
    cy.clearCache();
  });

  describe('Table widget', () => {
    it('should load the page', () => {
      cy.get(customElementName).should('exist');
    });

    it('should display all the entity fields in the component', () => {
      cy.contains('entities.bankAccount.name').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.bankNumber').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.agencyNumber').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.lastOperationDuration')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('entities.bankAccount.meanOperationDuration')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('entities.bankAccount.balance').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.openingDay').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.lastOperationDate').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.active').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.accountType').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.attachment').scrollIntoView().should('be.visible');
      cy.contains('entities.bankAccount.description').scrollIntoView().should('be.visible');
    });
  });
});
