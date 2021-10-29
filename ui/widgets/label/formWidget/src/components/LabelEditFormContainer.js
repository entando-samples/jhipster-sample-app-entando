import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import keycloakType from 'components/__types__/keycloak';
import withKeycloak from 'auth/withKeycloak';
import { AuthenticatedView, UnauthenticatedView } from 'auth/KeycloakViews';
import { apiLabelGet, apiLabelDelete, apiLabelPut } from 'api/labels';
import Notification from 'components/common/Notification';
import LabelForm from 'components/LabelForm';

class LabelEditFormContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      notificationMessage: null,
      notificationStatus: null,
    };

    this.closeNotification = this.closeNotification.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak, id } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    const changedId = id && id !== prevProps.id;

    if (authenticated && (changedId || changedAuth)) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { keycloak, id, serviceUrl } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated && id) {
      try {
        const label = await apiLabelGet(serviceUrl, id);
        this.setState(() => ({
          label,
        }));
      } catch (err) {
        this.handleError(err);
      }
    }
  }

  closeNotification() {
    this.setState(() => ({
      notificationMessage: null,
    }));
  }

  async handleSubmit(label) {
    const { t, onUpdate, keycloak, serviceUrl } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
        const updatedLabel = await apiLabelPut(serviceUrl, label);
        onUpdate(updatedLabel);

        this.setState({
          label: updatedLabel,
          notificationMessage: t('common.dataSaved'),
          notificationStatus: Notification.SUCCESS,
        });
      } catch (err) {
        this.handleError(err);
      }
    }
  }

  async handleDelete(label) {
    const { t, onDelete, keycloak, serviceUrl } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
        await apiLabelDelete(serviceUrl, label.id);
        onDelete(label);
        this.setState({
          label: null,
          notificationMessage: t('common.dataDeleted'),
          notificationStatus: Notification.SUCCESS,
        });
      } catch (err) {
        this.handleError(err);
      }
    }
  }

  handleError(err) {
    const { t, onError } = this.props;
    onError(err);
    this.setState(() => ({
      notificationMessage: t('error.dataLoading'),
      notificationStatus: Notification.ERROR,
    }));
  }

  render() {
    const { keycloak, onCancelEditing, t } = this.props;
    const { notificationMessage, notificationStatus, label } = this.state;

    let form;
    if (typeof label === 'undefined') {
      form = t('entities.label.notFound');
    } else if (label === null) {
      form = t('entities.label.deleted');
    } else {
      form = (
        <LabelForm
          label={label}
          onSubmit={this.handleSubmit}
          onCancelEditing={onCancelEditing}
          onDelete={this.handleDelete}
        />
      );
    }
    return (
      <>
        <UnauthenticatedView keycloak={keycloak}>
          {t('common.notAuthenticated')}
        </UnauthenticatedView>
        <AuthenticatedView keycloak={keycloak}>{form}</AuthenticatedView>
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </>
    );
  }
}

LabelEditFormContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onCancelEditing: PropTypes.func,
  onError: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  t: PropTypes.func.isRequired,
  keycloak: keycloakType.isRequired,
  serviceUrl: PropTypes.string,
};

LabelEditFormContainer.defaultProps = {
  onCancelEditing: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onError: () => {},
  serviceUrl: '',
};

export default withKeycloak(withTranslation()(LabelEditFormContainer));
