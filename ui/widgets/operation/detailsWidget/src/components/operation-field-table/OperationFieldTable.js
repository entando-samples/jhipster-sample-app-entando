import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import operationType from 'components/__types__/operation';

const OperationFieldTable = ({ t, i18n: { language }, operation }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>{t('common.name')}</TableCell>
        <TableCell>{t('common.value')}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <span>{t('entities.operation.id')}</span>
        </TableCell>
        <TableCell data-testid="operationIdValue">
          <span>{operation.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.operation.date')}</span>
        </TableCell>
        <TableCell>
          <span>{operation.date && new Date(operation.date).toLocaleString(language)}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.operation.description')}</span>
        </TableCell>
        <TableCell>
          <span>{operation.description}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.operation.amount')}</span>
        </TableCell>
        <TableCell>
          <span>{operation.amount}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

OperationFieldTable.propTypes = {
  operation: operationType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

OperationFieldTable.defaultProps = {
  operation: [],
};

export default withTranslation()(OperationFieldTable);
