import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import bankAccountType from 'components/__types__/bankAccount';

const styles = {
  tableRoot: {
    marginTop: '10px',
  },
  rowRoot: {
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  noItems: {
    margin: '15px',
  },
};

const BankAccountTable = ({ items, onSelect, classes, t, i18n, Actions }) => {
  const tableRows = items.map(item => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell><span>{item.name}</span></TableCell>
      <TableCell><span>{item.bankNumber}</span></TableCell>
      <TableCell><span>{item.agencyNumber}</span></TableCell>
      <TableCell><span>{item.lastOperationDuration}</span></TableCell>
      <TableCell><span>{item.meanOperationDuration}</span></TableCell>
      <TableCell><span>{item.balance}</span></TableCell>
      <TableCell><span>{new Date(item.openingDay).toLocaleDateString(i18n.language)}</span></TableCell>
      <TableCell><span>{new Date(item.lastOperationDate).toLocaleString(i18n.language)}</span></TableCell>
      <TableCell align="center">
        <Checkbox disabled checked={item.active} />
      </TableCell>
      <TableCell><span>{item.accountType}</span></TableCell>
      <TableCell>
        <span>
          <a download="bankAccount" href={`data:${item.attachmentContentType};base64, ${item.attachment}`}>
            {t('common.download')}
          </a>
        </span>
      </TableCell>
      <TableCell><span>{item.description}</span></TableCell>
      {Actions && (
        <TableCell>
          <Actions item={item} />
        </TableCell>
      )}
    </TableRow>
  ));

  return (items.length ? (
    <Table className={classes.tableRoot} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>
            <span>{t('entities.bankAccount.name')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.bankNumber')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.agencyNumber')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.lastOperationDuration')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.meanOperationDuration')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.balance')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.openingDay')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.lastOperationDate')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.active')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.accountType')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.attachment')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.bankAccount.description')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.bankAccount.noItems')}</div>
  ));
};

BankAccountTable.propTypes = {
  items: PropTypes.arrayOf(bankAccountType).isRequired,
  onSelect: PropTypes.func,
  classes: PropTypes.shape({
    rowRoot: PropTypes.string,
    tableRoot: PropTypes.string,
    noItems: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
  Actions: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

BankAccountTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(BankAccountTable));
