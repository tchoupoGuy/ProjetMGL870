const client = require('prom-client');

// Crée un registre global
const register = new client.Registry();

// Active les métriques par défaut dans ce registre
client.collectDefaultMetrics({
  register,
  disableTotalNameSuffixForCounters: true,
});

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({
  disableTotalNameSuffixForCounters: true,
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
});

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP Request receive',
  labelNames: ['method', 'route', 'statusCode'],
});

module.exports = {
  client,
  httpRequestDurationMicroseconds,
  httpRequestCounter,
  collectDefaultMetrics,
};
