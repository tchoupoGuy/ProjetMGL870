// Importer les modules nécessaires pour OpenTelemetry
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const client = require('prom-client');
const morgan = require('morgan');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require('./config/logger');
require('dotenv').config();

const logLevel = process.env.LOG_LEVEL || 'info';
const serviceName = process.env.SERVICE_NAME || 'default-service';

// Initialiser les métriques Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({
  register,
  disableTotalNameSuffixForCounters: true,
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP Request receive',
  labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(httpRequestCounter);

// Créer une instance de SDK OpenTelemetry
const sdk = new NodeSDK({
  resource: new Resource({
    'service.name': process.env.SERVICE_NAME || 'node-api-a',
  }),
  spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
  traceExporter: new JaegerExporter({
    endpoint:
      process.env.OTEL_EXPORTER_JAEGER_ENDPOINT ||
      'http://jaeger:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Démarrer le SDK OpenTelemetry
sdk.start();

const app = express();
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URI;

// Connexion à MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

require('./models/Utilisateur');
const userRoutes = require('./routes/user.route');

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Middleware pour compter toutes les requêtes HTTP
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      statusCode: res.statusCode,
    });
  });
  next();
});

// Middleware pour traiter les erreurs d'authentification
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    logger.error(
      `Authenticated Middleware request error message: ${res
        .status(401)
        .json({ message: err.name + ': ' + err.message })}`
    );
    res.status(401).json({ message: err.name + ': ' + err.message });
  } else {
    next(err);
  }
});

// Configurer le reste des middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));
app.use('/users', userRoutes);

// Initialisation de Passport pour l'authentification
require('./config/passport');
app.use(passport.initialize());

// Lancer le serveur
const server = app.listen(port, function () {
  logger.info(`Listening on port ${port}`);
  console.log('Listening on port ' + port);
});

// Exposer les métriques sur l'endpoint /metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

logger.info(
  `Starting service: ${serviceName}, Log level: ${logLevel}, Loki Host: ${process.env.LOKI_HOST}`
);
