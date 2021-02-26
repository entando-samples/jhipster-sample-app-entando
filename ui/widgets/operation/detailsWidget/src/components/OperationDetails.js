import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import operationType from 'components/__types__/operation';
import OperationFieldTable from 'components/operation-field-table/OperationFieldTable';

const OperationDetails = ({ t, operation }) => {
  return (
    <Box>
      <h3 data-testid="details_title">
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Operation',
        })}
      </h3>
      <OperationFieldTable operation={operation} />
    </Box>
  );
};

OperationDetails.propTypes = {
  operation: operationType,
  t: PropTypes.func.isRequired,
};

OperationDetails.defaultProps = {
  operation: {},
};

export default withTranslation()(OperationDetails);
