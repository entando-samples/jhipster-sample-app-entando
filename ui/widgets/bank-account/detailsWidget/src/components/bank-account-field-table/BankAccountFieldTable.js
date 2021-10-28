import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import bankAccountType from 'components/__types__/bankAccount';

const BankAccountFieldTable = ({ t, i18n: { language }, bankAccount }) => (
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
          <span>{t('entities.bankAccount.id')}</span>
        </TableCell>
        <TableCell data-testid="bankAccountIdValue">
          <span>{bankAccount.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.name')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.name}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.bankNumber')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.bankNumber}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.agencyNumber')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.agencyNumber}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.lastOperationDuration')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.lastOperationDuration}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.meanOperationDuration')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.meanOperationDuration}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.balance')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.balance}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.openingDay')}</span>
        </TableCell>
        <TableCell>
          <span>
            {bankAccount.openingDay &&
              new Date(bankAccount.openingDay).toLocaleDateString(language)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.lastOperationDate')}</span>
        </TableCell>
        <TableCell>
          <span>
            {bankAccount.lastOperationDate &&
              new Date(bankAccount.lastOperationDate).toLocaleString(language)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.active')}</span>
        </TableCell>
        <TableCell>
          <span>
            <Checkbox disabled checked={bankAccount.active} />
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.accountType')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.accountType}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.attachment')}</span>
        </TableCell>
        <TableCell>
          <span>
            <a
              download="filename"
              href={`data:${bankAccount.attachmentContentType};base64, ${bankAccount.attachment}`}
            >
              {t('common.download')}
            </a>
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.bankAccount.description')}</span>
        </TableCell>
        <TableCell>
          <span>{bankAccount.description}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

BankAccountFieldTable.propTypes = {
  bankAccount: bankAccountType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

BankAccountFieldTable.defaultProps = {
  bankAccount: [],
};

export default withTranslation()(BankAccountFieldTable);
