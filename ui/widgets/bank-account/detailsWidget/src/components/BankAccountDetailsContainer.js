import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

import keycloakType from 'components/__types__/keycloak';
import withKeycloak from 'auth/withKeycloak';
import { AuthenticatedView, UnauthenticatedView } from 'auth/KeycloakViews';
import BankAccountDetails from 'components/BankAccountDetails';
import Notification from 'components/common/Notification';
import { apiBankAccountGet } from 'api/bankAccount';

class BankAccountDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      bankAccount: {},
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
        const bankAccount = await apiBankAccountGet(serviceUrl, id);
        this.setState(() => ({
          bankAccount,
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
    const { bankAccount, notificationStatus, notificationMessage, loading } = this.state;
    const { t, keycloak } = this.props;

    return (
      <ThemeProvider theme={this.theme}>
        <UnauthenticatedView keycloak={keycloak}>
          {t('common.notAuthenticated')}
        </UnauthenticatedView>
        <AuthenticatedView keycloak={keycloak}>
          {loading && t('common.loading')}
          {!loading && <BankAccountDetails bankAccount={bankAccount} />}
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

BankAccountDetailsContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onError: PropTypes.func,
  t: PropTypes.func.isRequired,
  keycloak: keycloakType.isRequired,
  serviceUrl: PropTypes.string,
};

BankAccountDetailsContainer.defaultProps = {
  onError: () => {},
  serviceUrl: '',
};

export default withKeycloak(withTranslation()(BankAccountDetailsContainer));
