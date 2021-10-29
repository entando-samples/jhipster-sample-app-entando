import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiOperationPost } from 'api/operations';
import OperationAddFormContainer from 'components/OperationAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import operationMock from 'components/__mocks__/operationMocks';

jest.mock('api/operations');
jest.mock('@material-ui/pickers', () => {
  // eslint-disable-next-line react/prop-types
  const MockPicker = ({ id, value, name, label, onChange }) => {
    const handleChange = (event) => onChange(event.currentTarget.value);
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

describe('OperationAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiOperationPost.mockImplementation((data) => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <OperationAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const dateField = await findByLabelText('entities.operation.date');
    fireEvent.change(dateField, { target: { value: operationMock.date } });
    const descriptionField = await findByLabelText('entities.operation.description');
    fireEvent.change(descriptionField, { target: { value: operationMock.description } });
    const amountField = await findByLabelText('entities.operation.amount');
    fireEvent.change(amountField, { target: { value: operationMock.amount } });
    rerender(<OperationAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiOperationPost).toHaveBeenCalledTimes(1);
      expect(apiOperationPost).toHaveBeenCalledWith('', operationMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiOperationPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <OperationAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const dateField = await findByLabelText('entities.operation.date');
    fireEvent.change(dateField, { target: { value: operationMock.date } });
    const descriptionField = await findByLabelText('entities.operation.description');
    fireEvent.change(descriptionField, { target: { value: operationMock.description } });
    const amountField = await findByLabelText('entities.operation.amount');
    fireEvent.change(amountField, { target: { value: operationMock.amount } });
    rerender(<OperationAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiOperationPost).toHaveBeenCalledTimes(1);
      expect(apiOperationPost).toHaveBeenCalledWith('', operationMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
