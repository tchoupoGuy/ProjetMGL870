// Importer les modules nécessaires pour OpenTelemetry
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const fs = require('fs');
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
const servicesApi = require('./services/api');
const {
  clicmedicCallCounter,
  clicmedicErrorCounter,
  clicmedicResponseTime,
  register,
} = require('./config/metrics');
// const axios = require('axios');
require('dotenv').config();

// Assurez-vous que le répertoire des logs existe
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Crée un flux d'écriture dans le fichier `api-a.log`
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'api-a.log'),
  { flags: 'a' }
);

const logLevel = process.env.LOG_LEVEL || 'info';
const serviceName = process.env.SERVICE_NAME || 'default-service';

// Initialiser les métriques Prometheus
// const register = new client.Registry();
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

// Utiliser `morgan` pour écrire les logs dans le fichier
//app.use(morgan('combined', { stream: accessLogStream }));

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

// async function executeApiCalls() {
//   await servicesApi.callCreateMedecin(); // Appel pour créer un médecin
//   await servicesApi.callCreatePatient(); // Appel pour créer un patient
//   await servicesApi.callLoginMedecin(); // Appel pour connecter un médecin
//   await servicesApi.callLoginPatient(); // Appel pour connecter un patient
// }

// setInterval(executeApiCalls, 5000);

async function executeApiCalls1() {
  logger.info('Début de la fonction executeApiCalls');

  try {
    logger.debug("Début de l'appel: callCreateMedecin");
    await servicesApi.callCreateMedecin();
    logger.info("Fin de l'appel: callCreateMedecin");
  } catch (error) {
    logger.error(`Une erreur s'est produite: ${error.message}`, {
      stack: error.stack,
    });
  }

  logger.info('Fin de la fonction executeApiCalls 1');
}
async function executeApiCalls2() {
  logger.info('Début de la fonction executeApiCalls 2');

  try {
    logger.debug("Début de l'appel: callCreatePatient");
    await servicesApi.callCreatePatient();
    logger.info("Fin de l'appel: callCreatePatient");
  } catch (error) {
    logger.error(`Une erreur s'est produite: ${error.message}`, {
      stack: error.stack,
    });
  }

  logger.info('Fin de la fonction executeApiCalls');
}
async function executeApiCalls3() {
  logger.info('Début de la fonction executeApiCalls 3');

  try {
    logger.debug("Début de l'appel: callLoginMedecin");
    await servicesApi.callLoginMedecin();
    logger.info("Fin de l'appel: callLoginMedecin");
  } catch (error) {
    logger.error(`Une erreur s'est produite: ${error.message}`, {
      stack: error.stack,
    });
  }

  logger.info('Fin de la fonction executeApiCalls');
}
async function executeApiCalls4() {
  logger.info('Début de la fonction executeApiCalls 4');

  try {
    logger.debug("Début de l'appel: callLoginPatient");
    await servicesApi.callLoginPatient();
    logger.info("Fin de l'appel: callLoginPatient");
  } catch (error) {
    logger.error(`Une erreur s'est produite: ${error.message}`, {
      stack: error.stack,
    });
  }

  logger.info('Fin de la fonction executeApiCalls');
}

async function executeApiCalls() {
  logger.info('Début de la fonction executeApiCalls');

  try {
    logger.debug("Début de l'appel: callCreateMedecin");
    await servicesApi.callCreateMedecin();
    logger.info("Fin de l'appel: callCreateMedecin");

    logger.debug("Début de l'appel: callCreatePatient");
    await servicesApi.callCreatePatient();
    logger.info("Fin de l'appel: callCreatePatient");

    logger.debug("Début de l'appel: callLoginMedecin");
    await servicesApi.callLoginMedecin();
    logger.info("Fin de l'appel: callLoginMedecin");

    logger.debug("Début de l'appel: callLoginPatient");
    await servicesApi.callLoginPatient();
    logger.info("Fin de l'appel: callLoginPatient");
  } catch (error) {
    logger.error(`Une erreur s'est produite: ${error.message}`, {
      stack: error.stack,
    });
  }

  logger.info('Fin de la fonction executeApiCalls');
}

setInterval(executeApiCalls1, 5000);
setInterval(executeApiCalls2, 5000);
setInterval(executeApiCalls3, 5000);
setInterval(executeApiCalls4, 5000);
setInterval(executeApiCalls, 5000);
