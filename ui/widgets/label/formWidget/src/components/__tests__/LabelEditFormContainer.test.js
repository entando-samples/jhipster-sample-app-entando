import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiLabelGet, apiLabelPut } from 'api/labels';
import LabelEditFormContainer from 'components/LabelEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import labelMock from 'components/__mocks__/labelMocks';

jest.mock('api/labels');

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

describe('LabelEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiLabelGet.mockImplementation(() => Promise.resolve(labelMock));
    const { queryByText } = render(
      <LabelEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
      expect(apiLabelGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiLabelGet.mockImplementation(() => Promise.resolve(labelMock));
    apiLabelPut.mockImplementation(() => Promise.resolve(labelMock));

    const { findByTestId, queryByText } = render(
      <LabelEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiLabelPut).toHaveBeenCalledTimes(1);
      expect(apiLabelPut).toHaveBeenCalledWith('', labelMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiLabelGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <LabelEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
      expect(apiLabelGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiLabelGet.mockImplementation(() => Promise.resolve(labelMock));
    apiLabelPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <LabelEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiLabelGet).toHaveBeenCalledTimes(1);
      expect(apiLabelGet).toHaveBeenCalledWith('', '1');

      expect(apiLabelPut).toHaveBeenCalledTimes(1);
      expect(apiLabelPut).toHaveBeenCalledWith('', labelMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
