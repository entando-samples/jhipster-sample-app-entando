import PropTypes from 'prop-types';

const operationType = PropTypes.shape({
  id: PropTypes.number,

  date: PropTypes.string,
  description: PropTypes.string,
  amount: PropTypes.number,
});

export default operationType;
