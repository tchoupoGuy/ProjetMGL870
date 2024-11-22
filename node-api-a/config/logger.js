const winston = require('winston');
const fluent = require('fluent-logger');
const Transport = require('winston-transport');

// Configuration de Fluent Bit
const FLUENT_HOST = process.env.FLUENT_HOST;
const FLUENT_PORT = process.env.FLUENT_PORT;

// Transport personnalisé pour Fluent Bit
class FluentTransport extends Transport {
  constructor(opts) {
    super(opts);
    fluent.configure(opts.tag, {
      host: opts.host || 'localhost',
      port: opts.port || 24224,
      timeout: opts.timeout || 3.0,
      reconnectInterval: opts.reconnectInterval || 600000,
    });
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    // Envoie le log à Fluent Bit
    fluent.emit('winston', {
      level: info.level,
      message: info.message,
      timestamp: new Date().toISOString(),
      ...info.metadata, // Ajout d'autres métadonnées
    });

    callback();
  }
}

// Configuration du logger Winston avec Fluent Bit
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Affiche les logs dans la console
    new FluentTransport({
      tag: 'application=node-api-a', // Tag à utiliser pour Fluent Bit
      host: FLUENT_HOST,
      port: FLUENT_PORT,
      timeout: 3.0,
      reconnectInterval: 600000,
    }),

    new winston.transports.File({ filename: 'combined.log' }), // Sauvegarde dans un fichier
  ],
});

module.exports = logger;
