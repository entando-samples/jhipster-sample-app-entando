import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import OperationDetails from 'components/OperationDetails';
import operationMock from 'components/__mocks__/operationMocks';

describe('OperationDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<OperationDetails operation={operationMock} />);

    expect(getByText('entities.operation.date')).toBeInTheDocument();
  });
});
