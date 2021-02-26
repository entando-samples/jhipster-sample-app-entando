import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import bankAccountType from 'components/__types__/bankAccount';
import BankAccountFieldTable from 'components/bank-account-field-table/BankAccountFieldTable';

const BankAccountDetails = ({ t, bankAccount }) => {
  return (
    <Box>
      <h3 data-testid="details_title">
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Bank Account',
        })}
      </h3>
      <BankAccountFieldTable bankAccount={bankAccount} />
    </Box>
  );
};

BankAccountDetails.propTypes = {
  bankAccount: bankAccountType,
  t: PropTypes.func.isRequired,
};

BankAccountDetails.defaultProps = {
  bankAccount: {},
};

export default withTranslation()(BankAccountDetails);
