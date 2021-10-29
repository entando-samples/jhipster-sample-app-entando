import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import BankAccountDetails from 'components/BankAccountDetails';
import bankAccountMock from 'components/__mocks__/bankAccountMocks';

describe('BankAccountDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<BankAccountDetails bankAccount={bankAccountMock} />);

    expect(getByText('entities.bankAccount.name')).toBeInTheDocument();
  });
});
