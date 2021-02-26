import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import labelType from 'components/__types__/label';

const LabelFieldTable = ({ t, label }) => (
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
          <span>{t('entities.label.id')}</span>
        </TableCell>
        <TableCell data-testid="labelIdValue">
          <span>{label.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.label.labelName')}</span>
        </TableCell>
        <TableCell>
          <span>{label.labelName}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

LabelFieldTable.propTypes = {
  label: labelType,
  t: PropTypes.func.isRequired,
};

LabelFieldTable.defaultProps = {
  label: [],
};

export default withTranslation()(LabelFieldTable);
