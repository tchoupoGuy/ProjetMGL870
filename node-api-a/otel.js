// Importer les modules nécessaires
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');

// Configurer le SDK OpenTelemetry
const sdk = new NodeSDK({
  resource: new Resource({
    'service.name': 'my-nodejs-service', // Remplacez par le nom de votre service
  }),
  spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()), // Exporter vers la console
  instrumentations: [getNodeAutoInstrumentations()], // Instrumentation automatique
});

// Démarrer le SDK
sdk.start().then(() => {
  console.log('OpenTelemetry SDK initialized with ConsoleSpanExporter');
});

// Ajoutez une fonction pour simuler des traces
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Écouter sur le port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
