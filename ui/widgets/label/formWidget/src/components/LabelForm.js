import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/label';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
class LabelForm extends PureComponent {
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
      t,
    } = this.props;

    const getHelperText = (field) => (errors[field] && touched[field] ? errors[field] : '');

    const handleSubmit = (e) => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit} className={classes.root} data-testid="label-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="label-labelName"
              error={errors.labelName && touched.labelName}
              helperText={getHelperText('labelName')}
              className={classes.textField}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.labelName}
              name="labelName"
              label={t('entities.label.labelName')}
            />
          </Grid>
          {onDelete && (
            <ConfirmationDialogTrigger
              onCloseDialog={this.handleConfirmationDialogAction}
              dialog={{
                title: t('entities.label.deleteDialog.title'),
                description: t('entities.label.deleteDialog.description'),
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
    );
  }
}

LabelForm.propTypes = {
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
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
};

LabelForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyLabel = {
  labelName: '',
};

const validationSchema = Yup.object().shape({
  labelName: Yup.string().required().min(3),
});

const formikBag = {
  mapPropsToValues: ({ label }) => label || emptyLabel,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'LabelForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(LabelForm);
