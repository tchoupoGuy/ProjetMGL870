const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-grpc');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Activer les logs de diagnostic pour le debugging (facultatif)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Définir l'URL du collecteur OTLP (Jaeger/Tempo)
const OTLP_ENDPOINT = process.env.OTLP_ENDPOINT || 'http://localhost:4317';

// Configuration de l'exporteur OTLP
const traceExporter = new OTLPTraceExporter({
  url: OTLP_ENDPOINT,
});

// Optionnel : Exporter les traces vers la console pour vérifier les données localement
const consoleExporter = new ConsoleSpanExporter();

// Créez un SDK OpenTelemetry pour tracer automatiquement vos bibliothèques
const sdk = new NodeSDK({
  traceExporter, // Exportateur principal (OTLP)
  instrumentations: [getNodeAutoInstrumentations()], // Instrumente automatiquement vos dépendances
});

// Initialiser OpenTelemetry
sdk
  .start()
  .then(() => {
    console.log(
      `OpenTelemetry Tracing initialisé avec OTLP Exporter vers ${OTLP_ENDPOINT}`
    );
  })
  .catch((error) => {
    console.error(
      "Erreur lors de l'initialisation du SDK OpenTelemetry:",
      error
    );
  });

// Gestion de l'arrêt propre lors de la fermeture de l'application
process.on('SIGTERM', async () => {
  try {
    console.log('Arrêt du SDK OpenTelemetry...');
    await sdk.shutdown();
    console.log('SDK OpenTelemetry arrêté avec succès.');
  } catch (error) {
    console.error("Erreur lors de l'arrêt du SDK OpenTelemetry:", error);
  } finally {
    process.exit(0);
  }
});
