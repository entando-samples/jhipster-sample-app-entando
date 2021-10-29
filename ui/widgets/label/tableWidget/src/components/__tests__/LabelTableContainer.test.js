import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import labelMocks from 'components/__mocks__/labelMocks';
import { apiLabelsGet } from 'api/labels';
import 'i18n/__mocks__/i18nMock';
import LabelTableContainer from 'components/LabelTableContainer';

jest.mock('api/labels');

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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = (Component) => {
    return (props) => (
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

describe('LabelTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiLabelsGet.mockImplementation(() => Promise.resolve({ labels: labelMocks, count: 2 }));
    const { queryByText } = render(<LabelTableContainer />);

    await wait(() => {
      expect(apiLabelsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiLabelsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<LabelTableContainer />);

    wait(() => {
      expect(apiLabelsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
