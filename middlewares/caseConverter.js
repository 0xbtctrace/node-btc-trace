import * as changeKeys from 'change-case/keys';

export const camelCaseRequest = (req, res, next) => {
  let { body, query } = req;

  if (body && typeof body === 'object') {
    body = changeKeys.camelCase(body, -1);
  }

  if (query && typeof query === 'object') {
    query = changeKeys.camelCase(query, -1);
  }

  req.body = body;
  req.query = query;

  next();
};

export const pascalCaseResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const pascalCased = changeKeys.snakeCase(data, -1);
    return originalJson.call(this, pascalCased);
  };

  next();
};
