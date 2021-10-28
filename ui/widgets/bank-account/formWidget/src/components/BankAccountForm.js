import 'date-fns';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/bankAccount';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFnsLocales from 'i18n/dateFnsLocales';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import ConfirmationDialogTrigger from 'components/common/ConfirmationDialogTrigger';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(3),
  },
  button: {
    marginBottom: '10px',
  },
  downloadAnchor: {
    color: 'inherit',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
    '&:link, &:visited, &:hover, &:active': {
      color: 'inherit',
      textDecoration: 'inherit',
      fontWeight: 'inherit',
    },
  },
  textField: {
    width: '100%',
  },
});
class BankAccountForm extends PureComponent {
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
    const dateLabelFn = (date) => (date ? new Date(date).toLocaleDateString(i18n.language) : '');
    const getHelperText = (field) => (errors[field] && touched[field] ? errors[field] : '');
    const getFormattedTime = () => {
      const today = new Date();
      return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    };

    const handleFiles = (field) => (event) => {
      const uploadedFile = event.target;
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        const imageData = dataURL.match(/data:([^;]*);base64,(.*)$/);
        if (imageData && imageData[1] && imageData[2]) {
          setFieldValue(field, imageData[2]);
          setFieldValue(`${field}ContentType`, imageData[1]);
        }
      };
      reader.readAsDataURL(uploadedFile.files[0]);
    };

    const handleSubmit = (e) => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateFnsLocales[i18n.language]}>
        <form onSubmit={handleSubmit} className={classes.root} data-testid="bankAccount-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-name"
                error={errors.name && touched.name}
                helperText={getHelperText('name')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                name="name"
                label={t('entities.bankAccount.name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-bankNumber"
                error={errors.bankNumber && touched.bankNumber}
                helperText={getHelperText('bankNumber')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.bankNumber}
                name="bankNumber"
                label={t('entities.bankAccount.bankNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-agencyNumber"
                error={errors.agencyNumber && touched.agencyNumber}
                helperText={getHelperText('agencyNumber')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.agencyNumber}
                name="agencyNumber"
                label={t('entities.bankAccount.agencyNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-lastOperationDuration"
                error={errors.lastOperationDuration && touched.lastOperationDuration}
                helperText={getHelperText('lastOperationDuration')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastOperationDuration}
                name="lastOperationDuration"
                label={t('entities.bankAccount.lastOperationDuration')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-meanOperationDuration"
                error={errors.meanOperationDuration && touched.meanOperationDuration}
                helperText={getHelperText('meanOperationDuration')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.meanOperationDuration}
                name="meanOperationDuration"
                label={t('entities.bankAccount.meanOperationDuration')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-balance"
                error={errors.balance && touched.balance}
                helperText={getHelperText('balance')}
                className={classes.textField}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.balance}
                name="balance"
                label={t('entities.bankAccount.balance')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                id="bankAccount-openingDay"
                error={errors.openingDay && touched.openingDay}
                helperText={getHelperText('openingDay')}
                className={classes.textField}
                onChange={handleDateChange('openingDay')}
                value={values.openingDay}
                labelFunc={dateLabelFn}
                name="openingDay"
                label={t('entities.bankAccount.openingDay')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="bankAccount-lastOperationDate"
                error={errors.lastOperationDate && touched.lastOperationDate}
                helperText={getHelperText('lastOperationDate')}
                className={classes.textField}
                onChange={handleDateChange('lastOperationDate')}
                value={values.lastOperationDate}
                labelFunc={dateTimeLabelFn}
                name="lastOperationDate"
                label={t('entities.bankAccount.lastOperationDate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Checkbox
                    id="bankAccount-active"
                    name="active"
                    onChange={handleChange}
                    inputProps={{ 'data-testid': 'bankAccount-active-checkbox' }}
                    checked={values.active}
                    value="bankAccount-active"
                    color="primary"
                  />
                }
                label={t('entities.bankAccount.active')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="bankAccount-accountType">
                {t('entities.bankAccount.accountType')}
              </InputLabel>
              <Select
                native
                id="bankAccount-accountType"
                error={errors.accountType && touched.accountType}
                className={classes.textField}
                value={values.accountType}
                name="accountType"
                onChange={handleChange}
              >
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <option value="" />
                <option value="CHECKING">CHECKING</option>
                <option value="SAVINGS">SAVINGS</option>
                <option value="LOAN">LOAN</option>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="attachment-upload-file-button">
                {t('entities.bankAccount.attachment')}
              </InputLabel>
              {values.attachment && (
                <a
                  className={classes.downloadAnchor}
                  download={`attachment-${getFormattedTime()}`}
                  href={`data:${values.attachmentContentType};base64, ${values.attachment}`}
                >
                  <Button className={classes.button}>{t('common.download')}</Button>
                </a>
              )}
              <input
                data-testid="attachment-uploader"
                style={{ display: 'none' }}
                id="attachment-upload-file-button"
                type="file"
                onChange={handleFiles('attachment')}
              />
              <label htmlFor="attachment-upload-file-button">
                <Button className={classes.button} component="span">
                  {t('common.selectFile')}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bankAccount-description"
                error={errors.description && touched.description}
                helperText={getHelperText('description')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                name="description"
                label={t('entities.bankAccount.description')}
              />
            </Grid>
            {onDelete && (
              <ConfirmationDialogTrigger
                onCloseDialog={this.handleConfirmationDialogAction}
                dialog={{
                  title: t('entities.bankAccount.deleteDialog.title'),
                  description: t('entities.bankAccount.deleteDialog.description'),
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

BankAccountForm.propTypes = {
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

BankAccountForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyBankAccount = {
  name: '',
  bankNumber: '',
  agencyNumber: '',
  lastOperationDuration: '',
  meanOperationDuration: '',
  balance: '',
  openingDay: null,
  lastOperationDate: null,
  active: false,
  accountType: '',
  attachment: '',
  description: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  bankNumber: Yup.number(),
  agencyNumber: Yup.number(),
  lastOperationDuration: Yup.number(),
  meanOperationDuration: Yup.number(),
  balance: Yup.number().required(),
  openingDay: Yup.date().nullable(),
  lastOperationDate: Yup.date().nullable(),
  active: Yup.boolean(),
  accountType: Yup.string(),
  attachment: Yup.string(),
  description: Yup.string(),
});

const formikBag = {
  mapPropsToValues: ({ bankAccount }) => bankAccount || emptyBankAccount,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'BankAccountForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(BankAccountForm);
