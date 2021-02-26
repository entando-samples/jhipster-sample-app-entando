import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/bank-accounts';

export const apiBankAccountGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiBankAccountPost = async (serviceUrl, bankAccount) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: bankAccount ? JSON.stringify(bankAccount) : null,
  };
  return request(url, options);
};

export const apiBankAccountPut = async (serviceUrl, bankAccount) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: bankAccount ? JSON.stringify(bankAccount) : null,
  };
  return request(url, options);
};

export const apiBankAccountDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
