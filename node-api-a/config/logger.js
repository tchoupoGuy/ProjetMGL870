const path = require('path');
const winston = require('winston');
const fluent = require('fluent-logger');
const Transport = require('winston-transport');

// Configuration de Fluent Bit
// const FLUENT_HOST = process.env.FLUENT_HOST || 'localhost';
// const FLUENT_PORT = process.env.FLUENT_PORT || 24224;
// Configuration des variables d'environnement
const FLUENT_HOST = process.env.FLUENT_HOST || 'localhost';
const FLUENT_PORT = process.env.FLUENT_PORT || 24224;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// Chemin vers le fichier de logs
const LOG_FILE_PATH = path.join(
  'C:',
  'git',
  'ETS',
  'ProjetMGL870',
  'node-api-a',
  'logs',
  'api-a.log'
);
// Transport personnalisé pour Fluent Bit
// Transport personnalisé pour Fluent Bit
class FluentTransport extends Transport {
  constructor(opts) {
    super(opts);

    // Initialisation de Fluentd avec `fluent.configure`
    fluent.configure(opts.tag, {
      host: opts.host || FLUENT_HOST,
      port: opts.port || FLUENT_PORT,
      timeout: opts.timeout || 3.0,
      reconnectInterval: opts.reconnectInterval || 600000,
    });

    // On vérifie que le client Fluentd est bien configuré
    if (!fluent.isConfigured) {
      console.error('Erreur de configuration Fluentd');
    }
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    try {
      // Envoi du log à Fluent Bit
      fluent.emit('winston', {
        level: info.level,
        message: info.message,
        timestamp: new Date().toISOString(),
        ...info.metadata, // Ajoute des métadonnées supplémentaires si présentes
      });
      callback();
    } catch (err) {
      console.error(
        `Erreur lors de l'envoi du log à Fluent Bit : ${err.message}`
      );
      callback(err);
    }
  }
}

// Configuration du logger Winston
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Affichage des logs dans la console (niveau DEBUG pour les logs internes)
    new winston.transports.Console({ level: 'debug' }),

    // Envoi des logs vers Fluent Bit
    new FluentTransport({
      tag: 'application=node-api-a', // Tag à utiliser pour Fluent Bit
      host: FLUENT_HOST,
      port: FLUENT_PORT,
      timeout: 3.0,
      reconnectInterval: 600000,
    }),

    // Sauvegarde des logs dans un fichier
    new winston.transports.File({ filename: LOG_FILE_PATH }),
  ],
});

// Exportation du logger pour l'utiliser dans d'autres fichiers
module.exports = logger;
