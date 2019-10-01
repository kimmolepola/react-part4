const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const requestLogger = (request, response, next) => {
  /* eslint-disable no-console */
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('...');
  /* eslint-enable no-console */
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unkonwn endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message); // eslint-disable-line no-console

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  } if (error.name === 'Forbidden') {
    return response.status(403).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
