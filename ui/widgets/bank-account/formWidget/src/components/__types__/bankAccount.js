import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  name: PropTypes.string.isRequired,
  bankNumber: PropTypes.number,
  agencyNumber: PropTypes.number,
  lastOperationDuration: PropTypes.number,
  meanOperationDuration: PropTypes.number,
  balance: PropTypes.number.isRequired,
  openingDay: PropTypes.string,
  lastOperationDate: PropTypes.string,
  active: PropTypes.bool,
  accountType: PropTypes.string,
  attachment: PropTypes.string,
  description: PropTypes.string,
});

export const formValues = PropTypes.shape({
  name: PropTypes.string,
  bankNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  agencyNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastOperationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meanOperationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openingDay: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  lastOperationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  active: PropTypes.bool,
  accountType: PropTypes.string,
  attachment: PropTypes.string,
  description: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  bankNumber: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  agencyNumber: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  lastOperationDuration: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  meanOperationDuration: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  balance: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  openingDay: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  lastOperationDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  accountType: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  attachment: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  bankNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  agencyNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  lastOperationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  meanOperationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  openingDay: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  lastOperationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  accountType: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  attachment: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
