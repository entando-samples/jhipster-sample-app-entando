import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import i18n from 'components/__mocks__/i18n';
import operationMocks from 'components/__mocks__/operationMocks';
import OperationTable from 'components/OperationTable';

describe('OperationTable', () => {
  it('shows operations', () => {
    const { getByText } = render(<OperationTable items={operationMocks} />);

    expect(getByText(
        new Date(operationMocks[0].date).toLocaleString(i18n.language)
    )).toBeInTheDocument();
    expect(getByText(
        new Date(operationMocks[1].date).toLocaleString(i18n.language)
    )).toBeInTheDocument();

    expect(getByText(
        operationMocks[0].description
    )).toBeInTheDocument();
    expect(getByText(
        operationMocks[1].description
    )).toBeInTheDocument();

    expect(getByText(
          operationMocks[0].amount.toString()
    )).toBeInTheDocument();
    expect(getByText(
          operationMocks[1].amount.toString()
    )).toBeInTheDocument();

  });

  it('shows no operations message', () => {
    const { queryByText } = render(<OperationTable items={[]} />);

    expect(queryByText(
        new Date(operationMocks[0].date).toLocaleString(i18n.language)
    )).not.toBeInTheDocument();
    expect(queryByText(
        new Date(operationMocks[1].date).toLocaleString(i18n.language)
    )).not.toBeInTheDocument();

    expect(queryByText(
        operationMocks[0].description
    )).not.toBeInTheDocument();
    expect(queryByText(
        operationMocks[1].description
    )).not.toBeInTheDocument();

    expect(queryByText(
          operationMocks[0].amount.toString()
    )).not.toBeInTheDocument();
    expect(queryByText(
          operationMocks[1].amount.toString()
    )).not.toBeInTheDocument();


    expect(queryByText('entities.operation.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <OperationTable items={operationMocks} onSelect={onSelectMock} />
    );

    fireEvent.click(getByText(
        new Date(operationMocks[0].date).toLocaleString(i18n.language)
    ));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
