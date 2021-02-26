import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/operations';

export const apiOperationGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiOperationPost = async (serviceUrl, operation) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: operation ? JSON.stringify(operation) : null,
  };
  return request(url, options);
};

export const apiOperationPut = async (serviceUrl, operation) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: operation ? JSON.stringify(operation) : null,
  };
  return request(url, options);
};

export const apiOperationDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
