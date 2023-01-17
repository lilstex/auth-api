const responseStatusCode = {
  success: 200,
  created: 201,
  no_content: 204,
  modified: 304,
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  unprocessable: 422,
  internal_server_error: 500,
  not_implemented: 501,
}


const successResponse = (message, data, res) => {
  res.status(responseStatusCode.success).json({
    status: true,
    message,
    data,
  });
}

const simpleResponse = (message, res) => {
  res.status(responseStatusCode.success).json({
    status: true,
    message,
  });
}

const loginResponse = (token, message, data, res) => {
  res.status(responseStatusCode.success).json({
    status: true,
    token,
    message,
    data,
  });
}

const createdResponse = (message, data, res) => {
  res.status(responseStatusCode.created).json({
    status: true,
    message,
    data,
  });
}

const failureResponse = (message, data, res) => {
  res.status(responseStatusCode.bad_request).json({
    status: false,
    message,
    data,
  });
}

const unAuthorizedResponse = (message, res) => {
  res.status(responseStatusCode.unauthorized).json({
    status: false,
    message,
  });
}

const forbiddenResponse = (message, res) => {
  res.status(responseStatusCode.forbidden).json({
    status: false,
    message,
  });
}

const UnprocessableResponse = (message, res) => {
  res.status(responseStatusCode.unprocessable).json({
    status: false,
    message,
  });
}

const insufficientParameters = (res) => {
  res.status(responseStatusCode.bad_request).json({
    status: false,
    message: 'Insufficient parameters',
  });
}

const DBError = (err, res) => {
  res.status(responseStatusCode.internal_server_error).json({
    status: false,
    message: 'Database error',
    err,
  });
}

const notFoundResponse = (message, res) => {
  res.status(responseStatusCode.not_found).json({
    status: false,
    message,
  });
}

const unknownError = (message, res, err) => {
  res.json({
    status: false,
    message,
    err,
  });
}

const serverError = (message, res, err) => {
  res.status(responseStatusCode.internal_server_error).json({
    status: false,
    message,
    err,
  });
}

const validatorError = (message, res) => {
  res.status(responseStatusCode.bad_request).json({
    status: false,
    message,
  });
}


module.exports = {
  successResponse,
  loginResponse,
  notFoundResponse,
  DBError,
  insufficientParameters,
  createdResponse,
  failureResponse,
  unAuthorizedResponse,
  UnprocessableResponse,
  forbiddenResponse,
  unknownError,
  serverError,
  validatorError,
  simpleResponse
}