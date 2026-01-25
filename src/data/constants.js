// 1. IMPORTE AS IMAGENS DO TOPO (Ajuste o caminho '../assets' conforme a localização do seu arquivo)
import drEvaImg from '../assets/dra-eva.jpg'; // ou .png, verifique a extensão!
import karenImg from '../assets/karen.png';
import lucienneImg from '../assets/lucienne.png';
import clinic1Img from '../assets/clinica-1.jpg';
import clinic2Img from '../assets/clinica-2.jpg';
import clinic3Img from '../assets/clinica-3.jpg';

// Imagens
export const IMAGES = {
  // 2. USE AS VARIÁVEIS IMPORTADAS (sem aspas)
  drEva: drEvaImg, 
  karen: karenImg,     
  lucienne: lucienneImg, 
  clinic1: clinic1Img, 
  clinic2: clinic2Img, 
  clinic3: clinic3Img,
  
  // Imagens externas continuam iguais (com aspas)
  heroBg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop"
};

// ... resto do código ...

export const TRANSLATIONS = {
  fr: {
    nav: { home: "Accueil", team: "L'Équipe", clinic: "Le Cabinet", login: "Connexion", mySpace: "Mon Espace", book: "Prendre Rendez-vous" },
    hero: { title: "Cabinet Médical du Seujet", subtitle: "Une médecine intégrative, humaine et connectée.", cta: "Rendez-vous en ligne" },
    clinic: { title: "Le Cabinet", inclusivity: "Espace inclusif LGBTQ+ & Safe Space", accessibility: "Accessible aux personnes à mobilité réduite" },
    doctors: { title: "Notre Équipe", bio: "Biographie", contact: "Contact", book: "Prendre RDV" },
    services: { title: "Nos Prestations" },
    testimonials: { title: "Témoignages", subtitle: "La confiance de nos patients" },
    footer: { rights: "Tous droits réservés.", privacy: "Politique de Confidentialité", quickLinks: "Liens Rapides", contact: "Contact" }
  },
  en: {
    nav: { home: "Home", team: "The Team", clinic: "The Clinic", login: "Login", mySpace: "My Space", book: "Book Appointment" },
    hero: { title: "Cabinet Médical du Seujet", subtitle: "Integrative, human, and connected medicine.", cta: "Book Online" },
    clinic: { title: "The Clinic", inclusivity: "LGBTQ+ Inclusive & Safe Space", accessibility: "Wheelchair Accessible" },
    doctors: { title: "Our Team", bio: "Biography", contact: "Contact", book: "Book Now" },
    services: { title: "Our Services" },
    testimonials: { title: "Testimonials", subtitle: "Our patients' trust" },
    footer: { rights: "All rights reserved.", privacy: "Privacy Policy", quickLinks: "Quick Links", contact: "Contact" }
  }
};

export const DEFAULT_SERVICES = [
  { 
    iconType: "Stethoscope",
    title: { fr: "Médecine Interne Générale", en: "General Internal Medicine" }, 
    description: { fr: "Prise en charge globale et suivi des maladies chroniques.", en: "Comprehensive care and monitoring of chronic diseases." }
  },
  { 
    iconType: "Activity",
    title: { fr: "Médecine d'Urgence", en: "Emergency Medicine" }, 
    description: { fr: "Soins aigus et traumatologie (SSMUS).", en: "Acute care and traumatology (SSMUS)." }
  },
  { 
    iconType: "Syringe",
    title: { fr: "Vitaminothérapie IV", en: "IV Vitamin Therapy" }, 
    description: { fr: "Thérapies vitaminiques intraveineuses personnalisées.", en: "Personalized intravenous vitamin therapies." }
  },
  { 
    iconType: "Heart",
    title: { fr: "Médecine Intégrative", en: "Integrative Medicine" }, 
    description: { fr: "Approche globale : physique, psychologique et sociale.", en: "Global approach: physical, psychological, and social." }
  },
  { 
    iconType: "Users",
    title: { fr: "Santé LGBTQ+", en: "LGBTQ+ Health" }, 
    description: { fr: "Soins inclusifs, sans jugement et adaptés à toutes les identités.", en: "Inclusive, non-judgmental care adapted to all identities." }
  },
  { 
    iconType: "Shield",
    title: { fr: "Prévention", en: "Prevention" }, 
    description: { fr: "Préservation d'une parfaite santé à tous les niveaux.", en: "Preservation of perfect health at all levels." }
  }
];

export const DEFAULT_DOCTORS = [
  {
    id: "doc1",
    name: "Dr. Eva Niyibizi",
    email: "eva@gmseujet.ch", 
    role: "Médecin Responsable",
    bookable: true, 
    specialty: { fr: "Médecine Générale (FMH)", en: "General Practitioner (GP)" },
    description: { fr: "Spécialiste FMH, approche intégrative et urgences médicales.", en: "FMH Specialist, integrative approach and medical emergencies." },
    biography: {
      fr: "Le Dr Eva Niyibizi reçoit les patients au Quai du Seujet 14. Elle propose des consultations en français, anglais, hébreu et kinyarwanda. Elle pratique la médecine générale (suivi, urgences, accidents) et propose des téléconsultations. Note: Elle n'accepte pas de nouveaux patients pour le moment.",
      en: "Dr. Eva Niyibizi receives patients at Quai du Seujet 14. She offers consultations in French, English, Hebrew, and Kinyarwanda. She practices general medicine (follow-ups, emergencies) and offers video consultations. Note: She currently does not accept new patients."
    },
    languages: ["Français", "English", "Hebrew", "Kinyarwanda"],
    image: IMAGES.drEva
  },
  {
    id: "team1",
    name: "Karen Brechbühl",
    email: "karen@gmseujet.ch",
    role: "Médecin Assistant",
    bookable: false, 
    specialty: { fr: "Médecine Interne", en: "Internal Medicine" },
    description: { fr: "En 3ème année de spécialisation, rigoureuse et multilingue.", en: "3rd year resident, rigorous and multilingual." },
    biography: {
      fr: "Actuellement en 3ème année de résidanat, Karen a acquis une solide expérience aux soins intensifs (Portugal) et en chirurgie (HUG). Elle parle couramment français, anglais et portugais. Ancienne joueuse de tennis classée, elle apporte dynamisme et rigueur à l'équipe.",
      en: "Currently a 3rd-year resident, Karen gained solid experience in ICU (Portugal) and surgery (HUG). Fluent in French, English, and Portuguese. A former ranked tennis player, she brings dynamism and rigor to the team."
    },
    languages: ["Français", "English", "Português", "Română"],
    image: IMAGES.karen
  },
  {
    id: "team2",
    name: "Lucienne Foyeme",
    email: "secretariat@gmseujet.ch",
    role: "Notre assistante médicale adorée",
    bookable: false, 
    specialty: { fr: "Administration & Soins", en: "Administration & Care" },
    description: { fr: "Le cœur battant du cabinet avec plus de 15 ans d'expérience.", en: "The beating heart of the clinic with over 15 years of experience." },
    biography: {
      fr: "Experte en soins (prises de sang, ECG, radiologie) et en gestion administrative depuis 2005. Lucienne est spécialisée dans le suivi des maladies chroniques. Elle est également pompier volontaire, témoignant de son dévouement aux autres.",
      en: "Expert in care (blood tests, ECG, radiology) and administrative management since 2005. Lucienne specializes in chronic disease monitoring. She is also a volunteer firefighter, demonstrating her dedication to others."
    },
    languages: ["Français", "English"], 
    image: IMAGES.lucienne
  }
];

export const DEFAULT_CLINIC_INFO = {
  description: {
    fr: "Situé au cœur de Genève, notre cabinet offre un espace moderne et chaleureux. Nous combinons expertise médicale et écoute attentive.",
    en: "Located in the heart of Geneva, our clinic offers a modern and welcoming space. We combine medical expertise with attentive listening."
  },
  address: "Quai du Seujet 14, 1201 Genève, Suíça",
  phone: "+41 22 700 70 70",
  email: "secretariat@gmseujet.ch",
  mapEmbedUrl: "https://maps.google.com/maps?q=Quai+du+Seujet+14,+1201+Genève&t=&z=15&ie=UTF8&iwloc=&output=embed",
  openingHours: "Lun-Ven: 08:00 - 18:00 | Sam: 09:00 - 12:00",
  emergencyInfo: "En cas d'urgence vitale, composez le 144.",
  policies: "Toute annulation doit être effectuée 24h à l'avance.",
  features: [
    { fr: "Accueil LGBTQ+", en: "LGBTQ+ Friendly" },
    { fr: "Accessible fauteuil roulant", en: "Wheelchair Accessible" },
    { fr: "Espace sûr Transgenre", en: "Transgender Safe Space" }
  ]
};

export const TESTIMONIALS = [
  {
    name: "Natalia Matveeva",
    text: {
      fr: "La Dre Niyibizi est extrêmement professionnelle, expérimentée, empathique, gentille et cherche toujours le meilleur résultat.",
      en: "Dr. Niyibizi is extremely professional, experienced, empathetic, kind, and always seeks the best outcome."
    },
    rating: 5
  },
  {
    name: "Noémie H",
    text: {
      fr: "Une médecin absolument remarquable. Compétente, très proactive et surtout une écoute attentive avec une rare empathie.",
      en: "An absolutely remarkable doctor. Competent, very proactive, and above all, attentive listening with rare empathy."
    },
    rating: 5
  },
  {
    name: "Laura Spendolini",
    text: {
      fr: "Médecin très professionnelle, à l'écoute de ses patients. Une médecin comme ça n'existe plus ! Je recommande à 200% !",
      en: "Very professional doctor, attentive to her patients. A doctor like this doesn't exist anymore! I recommend 200%!"
    },
    rating: 5
  },
  {
    name: "Flurin Ryffel",
    text: {
      fr: "Extrêmement compétente et professionnelle, ainsi qu'extrêmement attentionnée. Je ne pourrais pas demander mieux.",
      en: "Extremely competent and professional, as well as extremely caring. I couldn't ask for a better doctor."
    },
    rating: 5
  },
  {
    name: "Nicolas Blanchet",
    text: {
      fr: "Attentive, minutieuse et professionnelle. Elle offre un excellent suivi aux patients.",
      en: "Attentive, thorough, and professional. She offers excellent patient follow-up."
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