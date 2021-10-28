import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import i18n from 'components/__mocks__/i18n';
import bankAccountMocks from 'components/__mocks__/bankAccountMocks';
import BankAccountTable from 'components/BankAccountTable';

describe('BankAccountTable', () => {
  it('shows bankAccounts', () => {
    const { getByText } = render(<BankAccountTable items={bankAccountMocks} />);

    expect(getByText(bankAccountMocks[0].name)).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].name)).toBeInTheDocument();

    expect(getByText(bankAccountMocks[0].bankNumber.toString())).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].bankNumber.toString())).toBeInTheDocument();

    expect(getByText(bankAccountMocks[0].agencyNumber.toString())).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].agencyNumber.toString())).toBeInTheDocument();

    expect(getByText(bankAccountMocks[0].lastOperationDuration.toString())).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].lastOperationDuration.toString())).toBeInTheDocument();

    expect(getByText(bankAccountMocks[0].meanOperationDuration.toString())).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].meanOperationDuration.toString())).toBeInTheDocument();

    expect(getByText(bankAccountMocks[0].balance.toString())).toBeInTheDocument();
    expect(getByText(bankAccountMocks[1].balance.toString())).toBeInTheDocument();

    expect(
      getByText(new Date(bankAccountMocks[0].openingDay).toLocaleDateString(i18n.language))
    ).toBeInTheDocument();
    expect(
      getByText(new Date(bankAccountMocks[1].openingDay).toLocaleDateString(i18n.language))
    ).toBeInTheDocument();

    expect(
      getByText(new Date(bankAccountMocks[0].lastOperationDate).toLocaleString(i18n.language))
    ).toBeInTheDocument();
    expect(
      getByText(new Date(bankAccountMocks[1].lastOperationDate).toLocaleString(i18n.language))
    ).toBeInTheDocument();
  });

  it('shows no bankAccounts message', () => {
    const { queryByText } = render(<BankAccountTable items={[]} />);

    expect(queryByText(bankAccountMocks[0].name)).not.toBeInTheDocument();
    expect(queryByText(bankAccountMocks[1].name)).not.toBeInTheDocument();

    expect(queryByText(bankAccountMocks[0].bankNumber.toString())).not.toBeInTheDocument();
    expect(queryByText(bankAccountMocks[1].bankNumber.toString())).not.toBeInTheDocument();

    expect(queryByText(bankAccountMocks[0].agencyNumber.toString())).not.toBeInTheDocument();
    expect(queryByText(bankAccountMocks[1].agencyNumber.toString())).not.toBeInTheDocument();

    expect(
      queryByText(bankAccountMocks[0].lastOperationDuration.toString())
    ).not.toBeInTheDocument();
    expect(
      queryByText(bankAccountMocks[1].lastOperationDuration.toString())
    ).not.toBeInTheDocument();

    expect(
      queryByText(bankAccountMocks[0].meanOperationDuration.toString())
    ).not.toBeInTheDocument();
    expect(
      queryByText(bankAccountMocks[1].meanOperationDuration.toString())
    ).not.toBeInTheDocument();

    expect(queryByText(bankAccountMocks[0].balance.toString())).not.toBeInTheDocument();
    expect(queryByText(bankAccountMocks[1].balance.toString())).not.toBeInTheDocument();

    expect(
      queryByText(new Date(bankAccountMocks[0].openingDay).toLocaleDateString(i18n.language))
    ).not.toBeInTheDocument();
    expect(
      queryByText(new Date(bankAccountMocks[1].openingDay).toLocaleDateString(i18n.language))
    ).not.toBeInTheDocument();

    expect(
      queryByText(new Date(bankAccountMocks[0].lastOperationDate).toLocaleString(i18n.language))
    ).not.toBeInTheDocument();
    expect(
      queryByText(new Date(bankAccountMocks[1].lastOperationDate).toLocaleString(i18n.language))
    ).not.toBeInTheDocument();

    expect(queryByText(bankAccountMocks[0].accountType)).not.toBeInTheDocument();
    expect(queryByText(bankAccountMocks[1].accountType)).not.toBeInTheDocument();

    expect(queryByText('entities.bankAccount.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <BankAccountTable items={bankAccountMocks} onSelect={onSelectMock} />
    );

    fireEvent.click(getByText(bankAccountMocks[0].name));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
