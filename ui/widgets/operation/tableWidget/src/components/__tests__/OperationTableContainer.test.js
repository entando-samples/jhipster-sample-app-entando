import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import operationMocks from 'components/__mocks__/operationMocks';
import { apiOperationsGet } from 'api/operations';
import 'i18n/__mocks__/i18nMock';
import OperationTableContainer from 'components/OperationTableContainer';

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

describe('OperationTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiOperationsGet.mockImplementation(() =>
      Promise.resolve({ operations: operationMocks, count: 2 })
    );
    const { queryByText } = render(<OperationTableContainer />);

    await wait(() => {
      expect(apiOperationsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiOperationsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<OperationTableContainer />);

    wait(() => {
      expect(apiOperationsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
