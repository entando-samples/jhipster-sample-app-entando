import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import i18n from 'i18n/__mocks__/i18nMock';
import labelMock from 'components/__mocks__/labelMocks';
import LabelForm from 'components/LabelForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Label Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <LabelForm label={labelMock} />
      </ThemeProvider>
    );

    expect(getByLabelText('entities.label.labelName').value).toBe(
        labelMock.labelName
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <LabelForm label={labelMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('label-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
