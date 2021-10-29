import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiBankAccountGet } from 'api/bankAccount';
import bankAccountApiGetResponseMock from 'components/__mocks__/bankAccountMocks';
import BankAccountDetailsContainer from 'components/BankAccountDetailsContainer';

jest.mock('api/bankAccount');

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = (Component) => {
    return (props) => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        keycloak={{
          initialized: true,
          authenticated: true,
        }}
      />
    );
  };

  return withKeycloak;
});

beforeEach(() => {
  apiBankAccountGet.mockClear();
});

describe('BankAccountDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.resolve(bankAccountApiGetResponseMock));

    render(<BankAccountDetailsContainer id="1" />);

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.resolve(bankAccountApiGetResponseMock));

    const { getByText } = render(<BankAccountDetailsContainer id="1" />);

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.bankAccount.name')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.bankNumber')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.agencyNumber')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.lastOperationDuration')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.meanOperationDuration')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.balance')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.openingDay')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.lastOperationDate')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.active')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.accountType')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.attachment')).toBeInTheDocument();
      expect(getByText('entities.bankAccount.description')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiBankAccountGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<BankAccountDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('error.dataLoading')).toBeInTheDocument();
    });
  });
});
