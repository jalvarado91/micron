const { send, json } = require('micro');

const routeHandler = fn => async (req, res) => {
  const ok = data => send(res, 200, data);
  const badRequest = msg => send(res, 400, msg);
  const unauthorized = msg => send(res, 401, msg);
  const notFound = msg => send(res, 404, msg);
  const error =  err => send(res, 500, err);
  const body = ['PUT', 'POST', 'PATCH'].includes(req.method)
    && await json(req) || {};

  try {
    return fn({req, res, body, ok, badRequest, unauthorized, notFound, error})
  } catch (err) {
    console.error('❌[MICRON] UNCAUGHT ERROR!!!!', err);
    return error(err);
  }
};

const get = routeHandler;
const post = fn => routeHandler(params => {
  const { req, notFound } = params;
  return (req.method === 'POST') && fn(params) || notFound();
});

module.exports = { get, post };
