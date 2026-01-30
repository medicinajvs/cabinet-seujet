// Imagens
export const IMAGES = {
  drEva: "/assets/dra-eva.jpg", 
  karen: "/assets/karen.png",     
  lucienne: "/assets/lucienne.png", 
  clinic1: "/assets/clinica-1.jpg", 
  clinic2: "/assets/clinica-2.jpg", 
  clinic3: "/assets/clinica-3.jpg",
  heroBg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop"
};

export const TRANSLATIONS = {
  fr: {
    nav: { home: "Accueil", team: "L'Équipe", mission: "Mission & Enseignement", clinic: "Services", login: "Connexion", mySpace: "Mon Espace", book: "Prendre Rendez-vous" },
    hero: { 
      title: "Cabinet Médical du Seujet", 
      subtitle: "Cabinet médical formateur : transmission et formation des étudiants et internes.", 
      cta: "Prendre Rendez-vous" 
    },
    doctors: { title: "Notre Équipe", bio: "Biographie", contact: "Contact", book: "Prendre RDV" },
    testimonials: { title: "Témoignages", subtitle: "La confiance de nos patients" },
    clinic: { title: "Le Cabinet", inclusivity: "Espace inclusif", accessibility: "Accessible aux personnes à mobilité réduite" },
    sections: {
      mission: "Notre Mission",
      teaching: "Enseignement & Formation",
      services: "Nos Prestations",
      equipment: "Plateau Technique",
      care: "Salle de Soins",
      community: "Engagements & Réseau",
      multilingual: "Un cabinet multilingue"
    },
    // NOVAS TRADUÇÕES DO DASHBOARD
    dashboard: {
      title: "Mon Espace Santé",
      backHome: "Retour à l'accueil",
      userDefault: "Utilisateur",
      incompleteProfile: "Profil incomplet",
      historyBtn: "Historique",
      editProfileBtn: "Modifier mon profil",
      logoutBtn: "Déconnexion",
      needApptTitle: "Besoin d'un rendez-vous ?",
      bookApptBtn: "Prendre Rendez-vous",
      historyTitle: "Historique des Contacts",
      noHistory: "Aucun historique trouvé.",
      noHistorySub: "Vos prises de rendez-vous apparaîtront ici.",
      redirectOneDoc: "Redirection OneDoc",
      phoneCall: "Appel Téléphonique",
      interestRecorded: "Intérêt enregistré"
    },
    footer: { rights: "Tous droits réservés.", privacy: "Politique de Confidentialité", quickLinks: "Liens Rapides", contact: "Contact" }
  },
  en: {
    nav: { home: "Home", team: "The Team", mission: "Mission & Teaching", clinic: "Services", login: "Login", mySpace: "My Space", book: "Book Appointment" },
    hero: { 
      title: "Cabinet Médical du Seujet", 
      subtitle: "Training medical practice: transmission and training of students and residents.", 
      cta: "Book Appointment" 
    },
    doctors: { title: "Our Team", bio: "Biography", contact: "Contact", book: "Book Now" },
    testimonials: { title: "Testimonials", subtitle: "Our patients' trust" },
    clinic: { title: "The Clinic", inclusivity: "Inclusive Space", accessibility: "Wheelchair Accessible" },
    sections: {
      mission: "Our Mission",
      teaching: "Teaching & Training",
      services: "Our Services",
      equipment: "Technical Equipment",
      care: "Care Room",
      community: "Commitments & Network",
      multilingual: "A multilingual practice"
    },
    // DASHBOARD TRANSLATIONS
    dashboard: {
      title: "My Health Space",
      backHome: "Back to Home",
      userDefault: "User",
      incompleteProfile: "Incomplete Profile",
      historyBtn: "History",
      editProfileBtn: "Edit Profile",
      logoutBtn: "Logout",
      needApptTitle: "Need an appointment?",
      bookApptBtn: "Book Appointment",
      historyTitle: "Contact History",
      noHistory: "No history found.",
      noHistorySub: "Your appointments will appear here.",
      redirectOneDoc: "OneDoc Redirection",
      phoneCall: "Phone Call",
      interestRecorded: "Interest Recorded"
    },
    footer: { rights: "All rights reserved.", privacy: "Privacy Policy", quickLinks: "Quick Links", contact: "Contact" }
  }
};

export const CLINIC_VALUES = [
  { title: { fr: "Inclusion", en: "Inclusion" }, icon: "Heart" },
  { title: { fr: "Humanisme", en: "Humanism" }, icon: "Users" },
  { title: { fr: "Transmission", en: "Transmission" }, icon: "BookOpen" },
  { title: { fr: "Qualité", en: "Quality" }, icon: "Star" },
  { title: { fr: "Médecine Intégrative", en: "Integrative Medicine" }, icon: "Activity" }
];

export const TEACHING_INFO = {
  title: { fr: "Clinique Docente UNIGE", en: "UNIGE Teaching Clinic" },
  description: {
    fr: "Cabinet formateur rattaché à l'Université de Genève. Nous formons les étudiants de 2ème Bachelor et 3ème Master en Médecine Humaine.",
    en: "Training practice attached to UNIGE. We train 2nd Bachelor and 3rd Master students in Human Medicine."
  }
};

export const DEFAULT_SERVICES = [
  { iconType: "Stethoscope", title: { fr: "Médecine de Famille", en: "Family Medicine" }, description: { fr: "Suivi global et continu.", en: "Global and continuous care." } },
  { iconType: "Activity", title: { fr: "Médecine d'Urgence", en: "Emergency Medicine" }, description: { fr: "Prise en charge rapide des situations aiguës.", en: "Rapid care for acute situations." } },
  { iconType: "Globe", title: { fr: "Prévention Voyage", en: "Travel Prevention" }, description: { fr: "Conseils et vaccinations.", en: "Advice and vaccinations." } },
  { iconType: "Heart", title: { fr: "Santé Sexuelle", en: "Sexual Health" }, description: { fr: "Dépistage et prévention inclusive.", en: "Inclusive screening and prevention." } },
  { iconType: "Users", title: { fr: "Réseau Collaboratif", en: "Collaborative Network" }, description: { fr: "HUG, Cliniques privées, MEDIX.", en: "HUG, Private clinics, MEDIX." } },
  { iconType: "Video", title: { fr: "Téléconsultation", en: "Teleconsultation" }, description: { fr: "Consultations à distance.", en: "Remote consultations." } }
];

export const TECHNICAL_PLATFORM = {
  equipment: [
    { fr: "Laboratoire POCT", en: "POCT Laboratory" },
    { fr: "Ecographie POCUS", en: "POCUS Ultrasound" }
  ],
  careRoom: [
    { fr: "ECG", en: "ECG" },
    { fr: "MAPA", en: "ABPM" },
    { fr: "Oximétrie nocturne", en: "Nocturnal Oximetry" },
    { fr: "Perfusios IV (Vitamines / Fer)", en: "IV Infusions" },
    { fr: "Soins de plaies & Sutures", en: "Wound Care & Sutures" },
    { fr: "Vaccinations", en: "Vaccinations" }
  ]
};

export const COMMUNITY_ENGAGEMENTS = ["MedFem", "Onesimus", "FeminEM", "AfCEM"];

export const DEFAULT_DOCTORS = [
  {
    id: "doc1",
    name: "Dr. Eva Niyibizi",
    email: "niyibizi@hin.ch", 
    role: "Médecin Cheffe",
    bookable: true,
    bookingMethod: "onedoc_or_phone",
    oneDocLink: "https://www.onedoc.ch/en/general-practitioner-gp/geneva/pbqre/dr-eva-niyibizi",
    specialty: { fr: "Interniste & Urgentiste", en: "Internist & Emergency Physician" },
    description: { fr: "Double spécialité, 10 ans d'expérience (HUG, La Colline, Jérusalem).", en: "Dual specialty, 10 years exp." },
    biography: {
      fr: "La Dre Eva Niyibizi est doublement spécialiste en Médecine Interne Générale et en Médecine d'Urgence. Forte d'une expérience clinique de 10 ans, elle a exercé au sein d'institutions de renom telles que les Hôpitaux Universitaires de Genève (HUG), la Clinique La Colline, ainsi qu'à Jérusalem (Israël). Elle maintient une activité de Médecin Consultante aux urgences des HUG. Engagée, elle est membre active de MedFem, Onesimus, FeminEM et AfCEM. Elle dirige le Cabinet du Seujet avec une vision intégrative, inclusive et humaniste.",
      en: "Dr. Eva Niyibizi holds a dual specialization in General Internal Medicine and Emergency Medicine. With 10 years of clinical experience, she has practiced at HUG, Clinique La Colline, and in Jerusalem. She is a Consultant Doctor at HUG emergencies. Committed to the community, she is a member of MedFem, Onesimus, FeminEM, and AfCEM. She leads the practice with an integrative, inclusive, and humanistic vision."
    },
    languages: ["Français", "English", "Hebrew", "Kinyarwanda"],
    image: IMAGES.drEva
  },
  {
    id: "team1",
    name: "Karen Brechbühl",
    email: "niyibizi@hin.ch",
    role: "Médecin Assistant",
    bookable: true,
    bookingMethod: "phone_only",
    specialty: { fr: "Médecine Interne", en: "Internal Medicine" },
    description: { fr: "3ème année de résidanat (formation post-graduée).", en: "3rd year resident." },
    biography: {
      fr: "Actuellement en 3ème année de résidanat (formation post-graduée) en médecine interne, Karen Brechbühl se distingue par un parcours riche et international. Elle a acquis une solide expérience aux soins intensifs au Portugal et en chirurgie aux HUG. Polyglotte, elle consulte couramment en français, anglais et portugais, avec des notions de roumain. Ancienne joueuse de tennis d'élite, elle apporte rigueur et dynamisme à l'équipe.",
      en: "Currently in her 3rd year of residency in internal medicine, Karen Brechbühl stands out for her international background. She gained solid experience in intensive care in Portugal and surgery at HUG. A polyglot, she consults in French, English, and Portuguese. A former elite tennis player, she brings rigor and dynamism to the team."
    },
    languages: ["Français", "English", "Português", "Română"],
    image: IMAGES.karen
  },
  {
    id: "team2",
    name: "Lucienne Foyeme",
    email: "niyibizi@hin.ch",
    role: "Assistante Médicale",
    bookable: false, 
    specialty: { fr: "Administration & Soins", en: "Administration & Care" },
    description: { fr: "Le cœur battant du cabinet avec plus de 15 ans d'expérience.", en: "The beating heart of the clinic." },
    biography: {
      fr: "Pilier du cabinet, Lucienne Foyeme est une assistante médicale hautement qualifiée avec plus de 15 ans d'expérience. Experte technique, elle maîtrise parfaitement les prises de sang, ECG, radiologies et soins de plaies. Elle assure également une gestion administrative impeccable. Son dévouement aux autres se prolonge dans sa vie personnelle en tant que pompier volontaire.",
      en: "A pillar of the practice, Lucienne Foyeme is a highly skilled medical assistant with over 15 years of experience. A technical expert, she masters blood tests, ECGs, radiology, and wound care. She also ensures impeccable administrative management. Her dedication extends to her personal life as a volunteer firefighter."
    },
    languages: ["Français", "English"], 
    image: IMAGES.lucienne
  }
];

export const DEFAULT_CLINIC_INFO = {
  description: {
    fr: "Situé au cœur de Genève, notre cabinet offre un espace moderne dédié à la médecine de famille, l'enseignement et l'inclusion.",
    en: "Located in the heart of Geneva, our practice offers a modern space dedicated to family medicine, teaching, and inclusion."
  },
  address: "Quai du Seujet 14, 1201 Genève",
  phone: "+41 22 700 70 70",
  email: "niyibizi@hin.ch",
  mapEmbedUrl: "https://maps.google.com/maps?q=Quai+du+Seujet+14,+1201+Genève&t=&z=15&ie=UTF8&iwloc=&output=embed",
  openingHours: "Lun-Ven: 08:00 - 18:00",
  emergencyInfo: "En cas d'urgence vitale, composez le 144.",
  policies: "Annulation 24h à l'avance.",
  features: [
    { fr: "Communautés sous-représentées bienvenues", en: "Underrepresented communities welcome" },
    { fr: "Accessible fauteuil roulant", en: "Wheelchair Accessible" },
    { fr: "Cabinet Formateur", en: "Training Practice" }
  ]
};

export const TESTIMONIALS = [
  {
    name: "Natalia Matveeva",
    text: {
      fr: "La Dre Niyibizi est extrêmement professionnelle, expérimentée, empathique.",
      en: "Dr. Niyibizi is extremely professional, experienced, empathetic."
    },
    rating: 5
  },
  {
    name: "Noémie H",
    text: {
      fr: "Une médecin absolument remarquable. Compétente, très proactive.",
      en: "An absolutely remarkable doctor. Competent, very proactive."
    },
    rating: 5
  },
  {
    name: "Laura Spendolini",
    text: {
      fr: "Médecin très professionnelle, à l'écoute de ses patients.",
      en: "Very professional doctor, attentive to her patients."
    },
    rating: 5
  },
  {
    name: "Flurin Ryffel",
    text: {
      fr: "Extrêmement compétente et professionnelle.",
      en: "Extremely competent and professional."
    },
    rating: 5
  },
  {
    name: "Nicolas Blanchet",
    text: {
      fr: "Attentive, minutieuse et professionnelle.",
      en: "Attentive, thorough, and professional."
    },
    rating: 5
  }
];

export const PRIVACY_POLICY_TEXT = `
POLITIQUE DE CONFIDENTIALITÉ / PRIVACY POLICY

1. DONNÉES / DATA
FR: Nous collectons les données nécessaires à la gestion de vos rendez-vous.
EN: We collect data necessary for managing your appointments.

2. SÉCURITÉ / SECURITY
FR: Vos données sensibles sont stockées de manière cryptée.
EN: Your sensitive data is stored in an encrypted manner.
`;