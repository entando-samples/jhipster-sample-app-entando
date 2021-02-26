import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiOperationGet, apiOperationPut } from 'api/operations';
import OperationEditFormContainer from 'components/OperationEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import operationMock from 'components/__mocks__/operationMocks';

jest.mock('api/operations');

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

describe('OperationEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiOperationGet.mockImplementation(() => Promise.resolve(operationMock));
    const { queryByText } = render(
      <OperationEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
      expect(apiOperationGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiOperationGet.mockImplementation(() => Promise.resolve(operationMock));
    apiOperationPut.mockImplementation(() => Promise.resolve(operationMock));

    const { findByTestId, queryByText } = render(
      <OperationEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiOperationPut).toHaveBeenCalledTimes(1);
      expect(apiOperationPut).toHaveBeenCalledWith('', operationMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiOperationGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <OperationEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
      expect(apiOperationGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiOperationGet.mockImplementation(() => Promise.resolve(operationMock));
    apiOperationPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <OperationEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
      expect(apiOperationGet).toHaveBeenCalledWith('', '1');

      expect(apiOperationPut).toHaveBeenCalledTimes(1);
      expect(apiOperationPut).toHaveBeenCalledWith('', operationMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
