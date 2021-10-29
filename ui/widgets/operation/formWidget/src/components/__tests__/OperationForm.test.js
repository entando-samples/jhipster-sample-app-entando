import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import i18n from 'i18n/__mocks__/i18nMock';
import operationMock from 'components/__mocks__/operationMocks';
import OperationForm from 'components/OperationForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Operation Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <OperationForm operation={operationMock} />
      </ThemeProvider>
    );

    expect(getByLabelText('entities.operation.date').value).toBe(
      new Date(operationMock.date).toLocaleString(i18n.language)
    );
    expect(getByLabelText('entities.operation.description').value).toBe(operationMock.description);
    expect(getByLabelText('entities.operation.amount').value).toBe(operationMock.amount.toString());
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <OperationForm operation={operationMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('operation-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
