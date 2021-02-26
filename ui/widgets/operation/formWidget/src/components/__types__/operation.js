import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  date: PropTypes.string.isRequired,
  description: PropTypes.string,
  amount: PropTypes.number.isRequired,
});

export const formValues = PropTypes.shape({
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  description: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

export const formTouched = PropTypes.shape({
  date: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  amount: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
