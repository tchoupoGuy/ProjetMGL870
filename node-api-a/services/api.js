const axios = require('axios');
const logger = require('../config/logger');
const {
  clicmedicCallCounter,
  clicmedicResponseTime,
  clicmedicErrorCounter,
} = require('../config/metrics');
const axiosApi = require('./index');
const servicesType = require('./types');

const baseUrl = 'http://localhost:8080';
const axiosInstance = axios.create({ timeout: 5000 });

// Fonction générique pour gérer les appels API
const handleApiCall = async (endpoint, apiCall, params = []) => {
  clicmedicCallCounter.inc({ endpoint });
  const traceId = `trace-${Date.now()}-${Math.random()}`;
  const start = Date.now();

  logger.info(`Début de l'appel ${endpoint}`, { traceId });

  try {
    const response = await apiCall(...params);
    const duration = (Date.now() - start) / 1000;
    clicmedicResponseTime.observe({ endpoint }, duration);

    logger.info(`Succès ${endpoint}`, {
      traceId,
      data: response.data,
      status: response.status,
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status || 'unknown';
    clicmedicErrorCounter.inc({ endpoint, status });

    logger.error(`Échec ${endpoint}`, {
      traceId,
      status,
      message: error.message,
    });

    throw error;
  }
};

// Appel pour créer un patient
const callCreatePatient = async () => {
  const endpoint = 'callCreatePatient';
  const patients = servicesType.predefinedPatients;
  return Promise.all(
    patients.map((patient) =>
      handleApiCall(endpoint, axiosApi.createPatient, [patient])
    )
  );
};

// Appel pour créer un médecin
const callCreateMedecin = async () => {
  const endpoint = 'callCreateMedecin';
  const medecins = servicesType.predefinedMedecins;
  return Promise.all(
    medecins.map((medecin) =>
      handleApiCall(endpoint, axiosApi.createMedecin, [medecin])
    )
  );
};

// Appel pour connecter un patient
const callLoginPatient = async () => {
  const endpoint = 'callLoginPatient';
  const patients = servicesType.predefinedLoginPatient;

  return Promise.all(
    patients.map(async ({ identifiant, mdp, userType }) => {
      const userData = await handleApiCall(endpoint, axiosApi.loginUser, [
        identifiant,
        mdp,
        userType,
      ]);

      if (userData && userData.token) {
        const medecins = await handleApiCall(
          `${endpoint}_getMedecins`,
          axiosApi.getMedecins,
          [userData.token]
        );
        return { userData, medecins };
      }
    })
  );
};

// Appel pour connecter un médecin
const callLoginMedecin = async () => {
  const endpoint = 'callLoginMedecin';
  const medecins = servicesType.predefinedLoginMedecin;

  return Promise.all(
    medecins.map(async ({ identifiant, mdp, userType }) => {
      const userData = await handleApiCall(endpoint, axiosApi.loginUser, [
        identifiant,
        mdp,
        userType,
      ]);

      if (userData && userData.token) {
        const patients = await handleApiCall(
          `${endpoint}_getPatients`,
          axiosApi.getPatients,
          [userData.token]
        );
        return { userData, patients };
      }
    })
  );
};

// Export des services
const servicesApi = {
  callCreatePatient,
  callCreateMedecin,
  callLoginPatient,
  callLoginMedecin,
};

module.exports = servicesApi;
