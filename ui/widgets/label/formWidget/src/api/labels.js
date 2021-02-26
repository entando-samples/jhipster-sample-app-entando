import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/labels';

export const apiLabelGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiLabelPost = async (serviceUrl, label) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: label ? JSON.stringify(label) : null,
  };
  return request(url, options);
};

export const apiLabelPut = async (serviceUrl, label) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: label ? JSON.stringify(label) : null,
  };
  return request(url, options);
};

export const apiLabelDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
