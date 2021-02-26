import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiBankAccountGet, apiBankAccountPut } from 'api/bankAccounts';
import BankAccountEditFormContainer from 'components/BankAccountEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import bankAccountMock from 'components/__mocks__/bankAccountMocks';

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

describe('BankAccountEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.resolve(bankAccountMock));
    const { queryByText } = render(
      <BankAccountEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
      expect(apiBankAccountGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.resolve(bankAccountMock));
    apiBankAccountPut.mockImplementation(() => Promise.resolve(bankAccountMock));

    const { findByTestId, queryByText } = render(
      <BankAccountEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBankAccountPut).toHaveBeenCalledTimes(1);
      expect(apiBankAccountPut).toHaveBeenCalledWith('', bankAccountMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <BankAccountEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
      expect(apiBankAccountGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiBankAccountGet.mockImplementation(() => Promise.resolve(bankAccountMock));
    apiBankAccountPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <BankAccountEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBankAccountGet).toHaveBeenCalledTimes(1);
      expect(apiBankAccountGet).toHaveBeenCalledWith('', '1');

      expect(apiBankAccountPut).toHaveBeenCalledTimes(1);
      expect(apiBankAccountPut).toHaveBeenCalledWith('', bankAccountMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
