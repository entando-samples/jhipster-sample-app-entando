import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import bankAccountMocks from 'components/__mocks__/bankAccountMocks';
import { apiBankAccountsGet } from 'api/bankAccounts';
import 'i18n/__mocks__/i18nMock';
import BankAccountTableContainer from 'components/BankAccountTableContainer';

jest.mock('api/bankAccounts');

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = Component => {
    return props => (
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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = Component => {
    return props => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        pagination={{
          onChangeItemsPerPage: () => {},
          onChangeCurrentPage: () => {},
        }}
      />
    );
  };

  return withPagination;
});

describe('BankAccountTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiBankAccountsGet.mockImplementation(() =>
      Promise.resolve({ bankAccounts: bankAccountMocks, count: 2 })
    );
    const { queryByText } = render(<BankAccountTableContainer />);

    await wait(() => {
      expect(apiBankAccountsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiBankAccountsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<BankAccountTableContainer />);

    wait(() => {
      expect(apiBankAccountsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
