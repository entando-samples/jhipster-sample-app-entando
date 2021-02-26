import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import labelType from 'components/__types__/label';
import LabelFieldTable from 'components/label-field-table/LabelFieldTable';

const LabelDetails = ({ t, label }) => {
  return (
    <Box>
      <h3 data-testid="details_title">
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Label',
        })}
      </h3>
      <LabelFieldTable label={label} />
    </Box>
  );
};

LabelDetails.propTypes = {
  label: labelType,
  t: PropTypes.func.isRequired,
};

LabelDetails.defaultProps = {
  label: {},
};

export default withTranslation()(LabelDetails);
