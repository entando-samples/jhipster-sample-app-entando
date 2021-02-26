import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import i18n from 'components/__mocks__/i18n';
import labelMocks from 'components/__mocks__/labelMocks';
import LabelTable from 'components/LabelTable';

describe('LabelTable', () => {
  it('shows labels', () => {
    const { getByText } = render(<LabelTable items={labelMocks} />);

    expect(getByText(
        labelMocks[0].labelName
    )).toBeInTheDocument();
    expect(getByText(
        labelMocks[1].labelName
    )).toBeInTheDocument();

  });

  it('shows no labels message', () => {
    const { queryByText } = render(<LabelTable items={[]} />);

    expect(queryByText(
        labelMocks[0].labelName
    )).not.toBeInTheDocument();
    expect(queryByText(
        labelMocks[1].labelName
    )).not.toBeInTheDocument();


    expect(queryByText('entities.label.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <LabelTable items={labelMocks} onSelect={onSelectMock} />
    );

    fireEvent.click(getByText(
        labelMocks[0].labelName
    ));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
