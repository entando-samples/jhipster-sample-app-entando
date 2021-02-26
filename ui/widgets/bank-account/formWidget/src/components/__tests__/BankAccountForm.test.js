import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import i18n from 'i18n/__mocks__/i18nMock';
import bankAccountMock from 'components/__mocks__/bankAccountMocks';
import BankAccountForm from 'components/BankAccountForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('BankAccount Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <BankAccountForm bankAccount={bankAccountMock} />
      </ThemeProvider>
    );

    expect(getByLabelText('entities.bankAccount.name').value).toBe(
        bankAccountMock.name
    );
    expect(getByLabelText('entities.bankAccount.bankNumber').value).toBe(
        bankAccountMock.bankNumber.toString()
    );
    expect(getByLabelText('entities.bankAccount.agencyNumber').value).toBe(
        bankAccountMock.agencyNumber.toString()
    );
    expect(getByLabelText('entities.bankAccount.lastOperationDuration').value).toBe(
        bankAccountMock.lastOperationDuration.toString()
    );
    expect(getByLabelText('entities.bankAccount.meanOperationDuration').value).toBe(
        bankAccountMock.meanOperationDuration.toString()
    );
    expect(getByLabelText('entities.bankAccount.balance').value).toBe(
        bankAccountMock.balance.toString()
    );
    expect(getByLabelText('entities.bankAccount.openingDay').value).toBe(
        new Date(bankAccountMock.openingDay).toLocaleDateString(i18n.language)
    );
    expect(getByLabelText('entities.bankAccount.lastOperationDate').value).toBe(
        new Date(bankAccountMock.lastOperationDate).toLocaleString(i18n.language)
    );
    expect(getByLabelText('entities.bankAccount.active').value).toBe(
        'bankAccount-active'
    );
    expect(getByLabelText('entities.bankAccount.accountType').value).toBe(
        bankAccountMock.accountType
    );
    expect(getByLabelText('entities.bankAccount.description').value).toBe(
        bankAccountMock.description
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <BankAccountForm bankAccount={bankAccountMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('bankAccount-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
