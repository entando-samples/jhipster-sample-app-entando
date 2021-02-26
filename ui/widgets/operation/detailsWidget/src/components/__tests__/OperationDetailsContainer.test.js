import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiOperationGet } from 'api/operation';
import operationApiGetResponseMock from 'components/__mocks__/operationMocks';
import OperationDetailsContainer from 'components/OperationDetailsContainer';

jest.mock('api/operation');

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

beforeEach(() => {
  apiOperationGet.mockClear();
});

describe('OperationDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiOperationGet.mockImplementation(() => Promise.resolve(operationApiGetResponseMock));

    render(<OperationDetailsContainer id="1" />);

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiOperationGet.mockImplementation(() => Promise.resolve(operationApiGetResponseMock));

    const { getByText } = render(<OperationDetailsContainer id="1" />);

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.operation.date')).toBeInTheDocument();
      expect(getByText('entities.operation.description')).toBeInTheDocument();
      expect(getByText('entities.operation.amount')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiOperationGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<OperationDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiOperationGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
