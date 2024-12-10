const client = require('prom-client');

const register = new client.Registry();

const clicmedicCallCounter = new client.Counter({
  name: 'clicmedic_call_total',
  help: "Nombre total d'appels à clicmedic-api",
  labelNames: ['endpoint'], // Ajout du label 'endpoint'
});

const clicmedicResponseTime = new client.Histogram({
  name: 'clicmedic_response_time_seconds',
  help: 'Durée des réponses de clicmedic-api',
  buckets: [0.1, 0.5, 1, 2, 5],
});

const clicmedicErrorCounter = new client.Counter({
  name: 'clicmedic_error_total',
  help: "Nombre total d'erreurs de clicmedic-api",
  labelNames: ['endpoint', 'status'],
});

// Enregistrez les métriques dans le registre
register.registerMetric(clicmedicCallCounter);
register.registerMetric(clicmedicResponseTime);
register.registerMetric(clicmedicErrorCounter);

module.exports = {
  clicmedicCallCounter,
  clicmedicResponseTime,
  clicmedicErrorCounter,
  register,
};
