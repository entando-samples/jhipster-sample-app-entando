import PropTypes from 'prop-types';

const bankAccountType = PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string,
  bankNumber: PropTypes.number,
  agencyNumber: PropTypes.number,
  lastOperationDuration: PropTypes.number,
  meanOperationDuration: PropTypes.number,
  balance: PropTypes.number,
  openingDay: PropTypes.string,
  lastOperationDate: PropTypes.string,
  active: PropTypes.bool,
  accountType: PropTypes.string,
  attachment: PropTypes.string,
  description: PropTypes.string,
});

export default bankAccountType;
