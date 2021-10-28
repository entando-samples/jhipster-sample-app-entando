import React from 'react';
import ReactDOM from 'react-dom';

import KeycloakContext from 'auth/KeycloakContext';
import BankAccountDetailsContainer from 'components/BankAccountDetailsContainer';
import { subscribeToWidgetEvent } from 'helpers/widgetEvents';
import { KEYCLOAK_EVENT_TYPE } from 'custom-elements/widgetEventTypes';
import setLocale from 'i18n/setLocale';

const getKeycloakInstance = () =>
  (window &&
    window.entando &&
    window.entando.keycloak && { ...window.entando.keycloak, initialized: true }) || {
    initialized: false,
  };
const ATTRIBUTES = {
  serviceUrl: 'service-url',
  locale: 'locale',
};

class BankAccountDetailsElement extends HTMLElement {
  constructor(...args) {
    super(...args);

    this.mountPoint = null;
    this.unsubscribeFromKeycloakEvent = null;
    this.keycloak = getKeycloakInstance();
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);

    this.keycloak = { ...getKeycloakInstance(), initialized: true };

    this.unsubscribeFromKeycloakEvent = subscribeToWidgetEvent(KEYCLOAK_EVENT_TYPE, () => {
      this.keycloak = { ...getKeycloakInstance(), initialized: true };
      this.render();
    });

    this.render();
  }

  render() {
    const customEventPrefix = 'bankAccount.details.';

    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl) || '';

    const onError = (error) => {
      const customEvent = new CustomEvent(`${customEventPrefix}error`, {
        details: {
          error,
        },
      });
      this.dispatchEvent(customEvent);
    };

    const locale = this.getAttribute(ATTRIBUTES.locale);
    setLocale(locale);

    const id = this.getAttribute('id');

    const ReactComponent = React.createElement(BankAccountDetailsContainer, {
      id,
      onError,
      serviceUrl,
    });
    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>{ReactComponent}</KeycloakContext.Provider>,
      this.mountPoint
    );
  }

  disconnectedCallback() {
    if (this.unsubscribeFromKeycloakEvent) {
      this.unsubscribeFromKeycloakEvent();
    }
  }
}

customElements.define('bank-account-details', BankAccountDetailsElement);
