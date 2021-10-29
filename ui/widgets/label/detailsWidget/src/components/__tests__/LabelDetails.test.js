import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import LabelDetails from 'components/LabelDetails';
import labelMock from 'components/__mocks__/labelMocks';

describe('LabelDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<LabelDetails label={labelMock} />);

    expect(getByText('entities.label.labelName')).toBeInTheDocument();
  });
});
