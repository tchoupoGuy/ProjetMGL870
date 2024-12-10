const predefinedMedecins = [
  {
    nom: 'Mark',
    prenom: 'Manaman',
    email: 'markmanamanl432@mail.ca',
    telephone: '222-222-222',
    mdp: 'bomotdepasse',
    specialisation: '6e495c90-c877-488f-af0c-ce12825aafc8',
    numeroEmploye: 'EMP023723233339128',
    telephoneBureau: '333-333-333',
    lieuTravail: 'Hospital AXYZ',
    NIMC: 'NIMC63333238',
  },
  {
    nom: 'Patrick',
    prenom: 'Chave',
    email: 'patrickchavel432@mail.ca',
    telephone: '222-222-222',
    mdp: 'bomotdepasse',
    specialisation: '6e495c90-c877-488f-af0c-ce12825aafc8',
    numeroEmploye: 'EMP423723233339129',
    telephoneBureau: '333-333-333',
    lieuTravail: 'Hospital AXYZ',
    NIMC: 'NIMC54333211',
  },
  {
    nom: 'Emilie',
    prenom: 'Eliot',
    email: 'emilieeliot1@mail.ca',
    telephone: '222-222-222',
    mdp: 'bomotdepasse',
    specialisation: '770b1b14-f6d3-49c6-b068-f73fa5636585',
    numeroEmploye: 'EMP433723233339136',
    telephoneBureau: '333-333-333',
    lieuTravail: 'Hospital AXYZ',
    NIMC: 'NIMC56333271',
  },
];

const predefinedPatients = [
  {
    nom: 'Paul',
    prenom: 'Pogba',
    email: 'paulpogba@mail.ca',
    telephone: '111-111-111',
    mdp: 'bomotdepasse',
    numeroAssuranceMaladie: 'PAPA12237565435435123',
    dateNaissance: '1999-02-01',
  },
  {
    nom: 'Marylin',
    prenom: 'Monrow',
    email: 'marylynmonrow12345@mail.ca',
    telephone: '111-111-222',
    mdp: 'bomotdepasse',
    numeroAssuranceMaladie: 'MAMO23237565435435123',
    dateNaissance: '1999-02-01',
  },
  {
    nom: 'Charlie',
    prenom: 'Chaplin',
    email: 'charliechaplin@mail.ca',
    telephone: '111-111-222',
    mdp: 'bomotdepasse',
    numeroAssuranceMaladie: 'CHCH12237565435435123',
    dateNaissance: '1999-02-01',
  },
];

const predefinedLoginPatient = [
  {
    identifiant: 'CHRO12237565435435123',
    mdp: 'bomotdepasse',
    userType: 'patient',
  },
  {
    identifiant: 'PAPI12237565435435123',
    mdp: 'bomotdepasse',
    userType: 'patient',
  },
  {
    identifiant: 'CHCH12237565435435123',
    mdp: 'bomotdepasse',
    userType: 'patient',
  },
  {
    identifiant: 'MAMO23237565435435123',
    mdp: 'bomotdepasse',
    userType: 'patient',
  },
  {
    identifiant: 'PAPA12237565435435123',
    mdp: 'bomotdepasse',
    userType: 'patient',
  },
];
const predefinedLoginMedecin = [
  {
    identifiant: 'EMP523723233339127',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
  {
    identifiant: 'EMP223723233339124',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
  {
    identifiant: 'EMP323723233339125',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
  {
    identifiant: 'EMP433723233339136',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
  {
    identifiant: 'EMP423723233339129',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
  {
    identifiant: 'EMP023723233339128',
    mdp: 'bomotdepasse',
    userType: 'medecin',
  },
];

const servicesType = {
  predefinedMedecins,
  predefinedPatients,
  predefinedLoginMedecin,
  predefinedLoginPatient,
};

module.exports = servicesType;
