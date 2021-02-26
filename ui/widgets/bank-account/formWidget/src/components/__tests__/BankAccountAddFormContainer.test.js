import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiBankAccountPost } from 'api/bankAccounts';
import BankAccountAddFormContainer from 'components/BankAccountAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import bankAccountMock from 'components/__mocks__/bankAccountMocks';

jest.mock('api/bankAccounts');
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
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while(n){
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
};

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

describe('BankAccountAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiBankAccountPost.mockImplementation(data => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <BankAccountAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.bankAccount.name');
    fireEvent.change(nameField, { target: { value: bankAccountMock.name } });
    const bankNumberField = await findByLabelText('entities.bankAccount.bankNumber');
    fireEvent.change(bankNumberField, { target: { value: bankAccountMock.bankNumber } });
    const agencyNumberField = await findByLabelText('entities.bankAccount.agencyNumber');
    fireEvent.change(agencyNumberField, { target: { value: bankAccountMock.agencyNumber } });
    const lastOperationDurationField = await findByLabelText('entities.bankAccount.lastOperationDuration');
    fireEvent.change(lastOperationDurationField, { target: { value: bankAccountMock.lastOperationDuration } });
    const meanOperationDurationField = await findByLabelText('entities.bankAccount.meanOperationDuration');
    fireEvent.change(meanOperationDurationField, { target: { value: bankAccountMock.meanOperationDuration } });
    const balanceField = await findByLabelText('entities.bankAccount.balance');
    fireEvent.change(balanceField, { target: { value: bankAccountMock.balance } });
    const openingDayField = await findByLabelText('entities.bankAccount.openingDay');
    fireEvent.change(openingDayField, { target: { value: bankAccountMock.openingDay } });
    const lastOperationDateField = await findByLabelText('entities.bankAccount.lastOperationDate');
    fireEvent.change(lastOperationDateField, { target: { value: bankAccountMock.lastOperationDate } });
    if (bankAccountMock.active) {
      const activeField = await findByTestId('bankAccount-active-checkbox');
      fireEvent.click(activeField);
    }
    const accountTypeField = await findByLabelText('entities.bankAccount.accountType');
    fireEvent.change(accountTypeField, { target: { value: bankAccountMock.accountType } });
    const attachmentField = await findByTestId('attachment-uploader');
    const attachmentFile = dataURLtoFile(`data:application/pdf;base64,${bankAccountMock.attachment}`, 'attachment.pdf');
    fireEvent.change(attachmentField, { target: { files: [attachmentFile] } });
    const descriptionField = await findByLabelText('entities.bankAccount.description');
    fireEvent.change(descriptionField, { target: { value: bankAccountMock.description } });
    rerender(<BankAccountAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBankAccountPost).toHaveBeenCalledTimes(1);
      expect(apiBankAccountPost).toHaveBeenCalledWith('', bankAccountMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiBankAccountPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <BankAccountAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const nameField = await findByLabelText('entities.bankAccount.name');
    fireEvent.change(nameField, { target: { value: bankAccountMock.name } });
    const bankNumberField = await findByLabelText('entities.bankAccount.bankNumber');
    fireEvent.change(bankNumberField, { target: { value: bankAccountMock.bankNumber } });
    const agencyNumberField = await findByLabelText('entities.bankAccount.agencyNumber');
    fireEvent.change(agencyNumberField, { target: { value: bankAccountMock.agencyNumber } });
    const lastOperationDurationField = await findByLabelText('entities.bankAccount.lastOperationDuration');
    fireEvent.change(lastOperationDurationField, { target: { value: bankAccountMock.lastOperationDuration } });
    const meanOperationDurationField = await findByLabelText('entities.bankAccount.meanOperationDuration');
    fireEvent.change(meanOperationDurationField, { target: { value: bankAccountMock.meanOperationDuration } });
    const balanceField = await findByLabelText('entities.bankAccount.balance');
    fireEvent.change(balanceField, { target: { value: bankAccountMock.balance } });
    const openingDayField = await findByLabelText('entities.bankAccount.openingDay');
    fireEvent.change(openingDayField, { target: { value: bankAccountMock.openingDay } });
    const lastOperationDateField = await findByLabelText('entities.bankAccount.lastOperationDate');
    fireEvent.change(lastOperationDateField, { target: { value: bankAccountMock.lastOperationDate } });
    if (bankAccountMock.active) {
      const activeField = await findByTestId('bankAccount-active-checkbox');
      fireEvent.click(activeField);
    }
    const accountTypeField = await findByLabelText('entities.bankAccount.accountType');
    fireEvent.change(accountTypeField, { target: { value: bankAccountMock.accountType } });
    const attachmentField = await findByTestId('attachment-uploader');
    const attachmentFile = dataURLtoFile(`data:application/pdf;base64,${bankAccountMock.attachment}`, 'attachment.txt');
    fireEvent.change(attachmentField, { target: { files: [attachmentFile] } });
    const descriptionField = await findByLabelText('entities.bankAccount.description');
    fireEvent.change(descriptionField, { target: { value: bankAccountMock.description } });
    rerender(<BankAccountAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiBankAccountPost).toHaveBeenCalledTimes(1);
      expect(apiBankAccountPost).toHaveBeenCalledWith('', bankAccountMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
