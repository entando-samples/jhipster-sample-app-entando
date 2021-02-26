import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  labelName: PropTypes.string.isRequired,
});

export const formValues = PropTypes.shape({
  labelName: PropTypes.string,
});

export const formTouched = PropTypes.shape({
  labelName: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  labelName: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
