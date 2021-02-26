import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiLabelGet } from 'api/label';
import labelApiGetResponseMock from 'components/__mocks__/labelMocks';
import LabelDetailsContainer from 'components/LabelDetailsContainer';

jest.mock('api/label');

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
  apiLabelGet.mockClear();
});

describe('LabelDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiLabelGet.mockImplementation(() => Promise.resolve(labelApiGetResponseMock));

    render(<LabelDetailsContainer id="1" />);

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiLabelGet.mockImplementation(() => Promise.resolve(labelApiGetResponseMock));

    const { getByText } = render(<LabelDetailsContainer id="1" />);

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.label.labelName')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiLabelGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<LabelDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
