import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

import keycloakType from 'components/__types__/keycloak';
import withKeycloak from 'auth/withKeycloak';
import { AuthenticatedView, UnauthenticatedView } from 'auth/KeycloakViews';
import OperationDetails from 'components/OperationDetails';
import Notification from 'components/common/Notification';
import { apiOperationGet } from 'api/operation';

class OperationDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      operation: {},
      notificationStatus: null,
      notificationMessage: null,
    };

    this.theme = createMuiTheme();
    this.closeNotification = this.closeNotification.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { keycloak, id, serviceUrl } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated && id) {
      try {
        const operation = await apiOperationGet(serviceUrl, id);
        this.setState(() => ({
          operation,
          loading: false
        }));
      } catch (err) {
        this.handleError(err);
      }
    }
  }


  handleError(err) {
    const { t, onError } = this.props;
    onError(err);
    this.setState(() => ({
      notificationMessage: t('common.couldNotFetchData'),
      notificationStatus: Notification.ERROR,
      loading: false
    }));
  }

  closeNotification() {
    this.setState({
      notificationMessage: null
    });
  }

  render() {
    const { operation, notificationStatus, notificationMessage, loading } = this.state;
    const { t, keycloak } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <UnauthenticatedView keycloak={keycloak}>
          {t('common.notAuthenticated')}
        </UnauthenticatedView>
        <AuthenticatedView keycloak={keycloak}>
          {loading && t('common.loading')}
          {!loading && <OperationDetails operation={operation} />}
        </AuthenticatedView>
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </ThemeProvider>
    );
  }
}

OperationDetailsContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onError: PropTypes.func,
  t: PropTypes.func.isRequired,
  keycloak: keycloakType.isRequired,
  serviceUrl: PropTypes.string,
};

OperationDetailsContainer.defaultProps = {
  onError: () => {},
  serviceUrl: '',
};

export default withKeycloak(withTranslation()(OperationDetailsContainer));
