import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiLabelPost } from 'api/labels';
import LabelAddFormContainer from 'components/LabelAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import labelMock from 'components/__mocks__/labelMocks';

jest.mock('api/labels');
jest.mock('@material-ui/pickers', () => {
  // eslint-disable-next-line react/prop-types
  const MockPicker = ({ id, value, name, label, onChange }) => {
    const handleChange = event => onChange(event.currentTarget.value);
    return (
      <span>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} value={value || ''} onChange={handleChange} />
      </span>
    );
  };
  return {
    ...jest.requireActual('@material-ui/pickers'),
    DateTimePicker: MockPicker,
    DatePicker: MockPicker,
  };
});

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

describe('LabelAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiLabelPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <LabelAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const labelNameField = await findByLabelText('entities.label.labelName');
    fireEvent.change(labelNameField, { target: { value: labelMock.labelName } });
    rerender(<LabelAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiLabelPost).toHaveBeenCalledTimes(1);
      expect(apiLabelPost).toHaveBeenCalledWith('', labelMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiLabelPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <LabelAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const labelNameField = await findByLabelText('entities.label.labelName');
    fireEvent.change(labelNameField, { target: { value: labelMock.labelName } });
    rerender(<LabelAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiLabelPost).toHaveBeenCalledTimes(1);
      expect(apiLabelPost).toHaveBeenCalledWith('', labelMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
