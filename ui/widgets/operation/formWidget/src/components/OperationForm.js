import 'date-fns';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/operation';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFnsLocales from 'i18n/dateFnsLocales';
import TextField from '@material-ui/core/TextField';
import ConfirmationDialogTrigger from 'components/common/ConfirmationDialogTrigger';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
});
class OperationForm extends PureComponent {
  constructor(props) {
    super(props);
    this.handleConfirmationDialogAction = this.handleConfirmationDialogAction.bind(this);
  }

  handleConfirmationDialogAction(action) {
    const { onDelete, values } = this.props;
    switch (action) {
      case ConfirmationDialogTrigger.CONFIRM: {
        onDelete(values);
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {
      classes,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit: formikHandleSubmit,
      onDelete,
      onCancelEditing,
      isSubmitting,
      setFieldValue,
      t,
      i18n,
    } = this.props;

    const handleDateChange = (field) => (value) => {
      setFieldValue(field, value);
    };

    const dateTimeLabelFn = (date) => (date ? new Date(date).toLocaleString(i18n.language) : '');
    const getHelperText = (field) => (errors[field] && touched[field] ? errors[field] : '');

    const handleSubmit = (e) => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateFnsLocales[i18n.language]}>
        <form onSubmit={handleSubmit} className={classes.root} data-testid="operation-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="operation-date"
                error={errors.date && touched.date}
                helperText={getHelperText('date')}
                className={classes.textField}
                onChange={handleDateChange('date')}
                value={values.date}
                labelFunc={dateTimeLabelFn}
                name="date"
                label={t('entities.operation.date')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="operation-description"
                error={errors.description && touched.description}
                helperText={getHelperText('description')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                name="description"
                label={t('entities.operation.description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="operation-amount"
                error={errors.amount && touched.amount}
                helperText={getHelperText('amount')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                name="amount"
                label={t('entities.operation.amount')}
              />
            </Grid>
            {onDelete && (
              <ConfirmationDialogTrigger
                onCloseDialog={this.handleConfirmationDialogAction}
                dialog={{
                  title: t('entities.operation.deleteDialog.title'),
                  description: t('entities.operation.deleteDialog.description'),
                  confirmLabel: t('common.yes'),
                  discardLabel: t('common.no'),
                }}
                Renderer={({ onClick }) => (
                  <Button onClick={onClick} disabled={isSubmitting}>
                    {t('common.delete')}
                  </Button>
                )}
              />
            )}

            <Button onClick={onCancelEditing} disabled={isSubmitting} data-testid="cancel-btn">
              {t('common.cancel')}
            </Button>

            <Button type="submit" color="primary" disabled={isSubmitting} data-testid="submit-btn">
              {t('common.save')}
            </Button>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}

OperationForm.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    textField: PropTypes.string,
    submitButton: PropTypes.string,
    button: PropTypes.string,
    downloadAnchor: PropTypes.string,
  }),
  values: formValues,
  touched: formTouched,
  errors: formErrors,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancelEditing: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
};

OperationForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyOperation = {
  date: null,
  description: '',
  amount: '',
};

const validationSchema = Yup.object().shape({
  date: Yup.date().nullable().required(),
  description: Yup.string(),
  amount: Yup.number().required(),
});

const formikBag = {
  mapPropsToValues: ({ operation }) => operation || emptyOperation,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'OperationForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(OperationForm);
