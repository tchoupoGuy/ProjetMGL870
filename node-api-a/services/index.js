const axios = require('axios');

// Instance Axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// Fonction générique pour gérer les requêtes POST
const postRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'envoi POST vers ${url}:`, error.message);
    throw error;
  }
};

// Fonction générique pour gérer les requêtes GET
const getRequest = async (url, token = null) => {
  try {
    const headers = token ? { Authorization: token } : {};
    const response = await axiosInstance.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'envoi GET vers ${url}:`, error.message);
    throw error;
  }
};

// Fonctions spécifiques pour créer des utilisateurs
const createMedecin = async (accountDetails) =>
  postRequest('/auth/create-account', { type: 'medecin', accountDetails });

const createPatient = async (accountDetails) =>
  postRequest('/auth/create-account', { type: 'patient', accountDetails });

// Fonctions spécifiques pour la connexion
const loginUser = async (identifiant, mdp, userType) =>
  postRequest('/auth/login', { identifiant, mdp, userType });

// Fonctions pour récupérer des données
const getSpecialistes = async () => getRequest('/clicmedic/specialites');

const getMedecins = async (token) => getRequest('/clicmedic/medecin', token);

const getPatients = async (token) => getRequest('/clicmedic/patients', token);

// Exemple d'utilisation pour créer des comptes prédéfinis
const predefinedMedecins = [
  {
    nom: 'Thierry',
    prenom: 'Henrie',
    email: 'thierryhenriel432@mail.ca',
    telephone: '222-222-222',
    mdp: 'bomotdepasse',
    specialisation: '6e495c90-c877-488f-af0c-ce12825aafc8',
    numeroEmploye: 'EMP523723233339127',
    telephoneBureau: '333-333-333',
    lieuTravail: 'Hospital AXYZ',
    NIMC: 'NIMC52333227',
  },
  // Ajouter d'autres médecins ici...
];

// Exemple : création d'un médecin
(async () => {
  try {
    const response = await createMedecin(predefinedMedecins[0]);
    console.log('Compte médecin créé:', response);
  } catch (error) {
    console.error('Erreur lors de la création du médecin:', error.message);
  }
})();

const axiosApi = {
  createMedecin,
  createPatient,
  loginUser,
  getSpecialistes,
  getMedecins,
  getPatients,
};
module.exports = axiosApi;
// Export des services pour une utilisation externe
