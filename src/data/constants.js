// URL DA SUA API NO CLOUDFLARE WORKERS
export const CLOUDFLARE_API_URL = "https://cabinet-api.cabinet-seujet.workers.dev";

export const IMAGES = {
  drEva: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/dra-eva.jpg", 
  karen: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/karen.png",     
  lucienne: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/lucienne.png", 
  clinic1: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/clinica-1.jpg", 
  clinic2: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/clinica-2.jpg", 
  clinic3: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/clinica-3.jpg",
  heroBg: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/clinica-1.jpg",
  drCarole: "https://pub-f8f14c95b0824560b05131ba913cd2c5.r2.dev/assets/dra-carole.jpeg"
};

export const TRANSLATIONS = {
  fr: {
    nav: { home: "Accueil", team: "L'Équipe", mission: "Mission & Enseignement", clinic: "Services", infos: "Consultations", contact: "Accès & Contact", login: "Connexion", mySpace: "Mon Espace", book: "Prendre Rendez-vous" },
    hero: { 
      title: "Cabinet Médical du Seujet", 
      subtitle: "Cabinet médical formateur: transmission et formation des étudiants et internes.", 
      cta: "Prendre Rendez-vous" 
    },
    carousel: {
      rubricSubtitle: "Votre bien-être, notre mission.",
      clinicSlide1Title: "Un Espace Moderne",
      clinicSlide1Subtitle: "Dédié à votre santé et à l'inclusion.",
      clinicSlide2Title: "",
      clinicSlide2Subtitle: "Plusieurs examens peuvent être réalisés directement au cabinet: prises de sang, analyses urinaires, échographies, ECG ainsi que les frottis nasopharyngés (COVID-19, grippe, RSV)",
      clinicSlide3Title: "",
      clinicSlide3Subtitle: "Une équipe engagée pour votre santé et votre bien-être",
    },
    doctors: { title: "Notre Équipe", bio: "Biographie", contact: "Contact", book: "Prendre RDV" },
    testimonials: { title: "Témoignages", subtitle: "La confiance de nos patients" },
    clinic: { title: "Le Cabinet", inclusivity: "Espace inclusif", accessibility: "Accessible aux personnes à mobilité réduite" },
    sections: {
      mission: "Notre Mission",
      teaching: "Vocation Formatrice",
      services: "Nos Prestations",
      equipment: "Plateau Technique",
      care: "Salle de Soins (Procédures)",
      community: "Réseau Collaboratif",
      multilingual: "Un environnement multiculturel"
    },
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
    footer: { 
      rights: "Tous droits réservés.", 
      privacy: "Politique de Confidentialité", 
      quickLinks: "Liens Rapides", 
      contact: "Contact",
      engagementsTitle: "Engagements",
      missionText: "Notre mission est d'offrir une médecine de qualité, inclusive et intégrative, dans un cadre formateur et bienveillant."
    }
  },
  en: {
    nav: { home: "Home", team: "The Team", mission: "Mission & Teaching", clinic: "Services", infos: "Appointments", contact: "Access & Contact", login: "Login", mySpace: "My Space", book: "Book Appointment" },
    hero: { 
      title: "Cabinet Médical du Seujet", 
      subtitle: "Training medical practice: transmission and training of students and residents.", 
      cta: "Book Appointment" 
    },
    carousel: {
      rubricSubtitle: "Your well-being, our mission.",
      clinicSlide1Title: "A Modern Space",
      clinicSlide1Subtitle: "Dedicated to your health and inclusion.",
      clinicSlide2Title: "",
      clinicSlide2Subtitle: "Several exams can be performed directly at the practice: blood tests, urinalysis, ultrasounds, ECGs as well as nasopharyngeal swabs (COVID-19, flu, RSV)",
      clinicSlide3Title: "",
      clinicSlide3Subtitle: "A team committed to your health and well-being",
    },
    doctors: { title: "Our Team", bio: "Biography", contact: "Contact", book: "Book Now" },
    testimonials: { title: "Testimonials", subtitle: "Our patients' trust" },
    clinic: { title: "The Clinic", inclusivity: "Inclusive Space", accessibility: "Wheelchair Accessible" },
    sections: {
      mission: "Our Mission",
      teaching: "Formative Vocation",
      services: "Our Services",
      equipment: "Technical Equipment",
      care: "Care Room (Procedures)",
      community: "Collaborative Network",
      multilingual: "A multicultural environment"
    },
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
    footer: { 
      rights: "All rights reserved.", 
      privacy: "Privacy Policy", 
      quickLinks: "Quick Links", 
      contact: "Contact",
      engagementsTitle: "Commitments",
      missionText: "Our mission is to offer quality, inclusive, and integrative medicine in a formative and caring environment."
    }
  }
};

export const TEACHING_INFO = {
  title: { fr: "", en: "" },
  description: {
    fr: "Cabinet formateur accueillant des étudiants en médecine de l’UNIGE et des médecins en formation postgraduée, impliqué dans la transmission des connaissances et de la pratique clinique",
    en: "Training practice welcoming medical students from UNIGE and doctors in postgraduate training, involved in the transmission of knowledge and clinical practice"
  }
};

export const DEFAULT_SERVICES = [
  { iconType: "Stethoscope", title: { fr: "Médecine de Famille & Urgences Ambulatoires", en: "Family & Ambulatory Emergency Med" }, description: { fr: "Suivi global, continu et prise en charge des urgences.", en: "Global, continuous care and emergency management." } },
  { iconType: "Globe", title: { fr: "Prévention Voyage & Santé Sexuelle", en: "Travel & Sexual Health" }, description: { fr: "Conseils, vaccinations et dépistage.", en: "Advice, vaccinations, and screening." } },
  { iconType: "BookOpen", title: { fr: "Éducation Thérapeutique", en: "Therapeutic Education" }, description: { fr: "Information et accompagnement du patient dans la compréhension et la prise en charge de sa pathologie.", en: "Information and patient support in understanding and managing their pathology." } },
  { iconType: "Activity", title: { fr: "Réseau de Médecine Intégrative", en: "Integrative Med Network" }, description: { fr: "Prise en charge globale intégrant la médecine conventionnelle et certaines approches complémentaires, selon les besoins du patient et les recommandations en vigueur.", en: "Global care integrating conventional medicine and certain complementary approaches, according to patient needs and current recommendations." } },
  { iconType: "Users", title: { fr: "Travail en Réseau", en: "Collaborative Network" }, description: { fr: "Prise en charge coordonnée et interprofessionnelle.", en: "Coordinated and interprofessional care." } },
  { iconType: "Video", title: { fr: "Téléconsultation", en: "Teleconsultation" }, description: { fr: "Consultations médicales à distance sécurisées.", en: "Secure remote medical consultations." } }
];

export const TECHNICAL_PLATFORM = {
  equipment: [
    { fr: "Urgences Ambulatoires: prises de sang et analyses d’urine, avec résultats rapides sur place (POCT) et en collaboration avec un laboratoire externe (Viollier).", en: "Ambulatory Emergency: blood tests and urinalysis, with rapid on-site results (POCT) and in collaboration with an external laboratory (Viollier)." },
    { fr: "Échographie POCUS", en: "POCUS Ultrasound" }
  ],
  careRoom: [
    { fr: "ECG", en: "ECG" },
    { fr: "MAPA", en: "ABPM" },
    { fr: "Oximétrie nocturne", en: "Nocturnal Oximetry" },
    { fr: "Perfusios IV (Vitamines / Fer)", en: "IV Infusions (Vitamins / Iron)" },
    { fr: "Soins de plaies & Sutures", en: "Wound Care & Sutures" },
    { fr: "Vaccinations", en: "Vaccinations" }
  ]
};

export const COMMUNITY_ENGAGEMENTS = ["MedFem", "Onesimus", "FeminEM", "AfCEM", "Medix"];

export const DEFAULT_DOCTORS = [
  {
    id: "doc1",
    name: "Dre. Eva Niyibizi",
    email: "niyibizi@hin.ch", 
    role: "Absente (Remplacée par Dre Carole Rabetokotany)", 
    bookable: false,
    bookingMethod: "onedoc_or_phone",
    oneDocLink: "https://www.onedoc.ch/en/general-practitioner-gp/geneva/pbqre/dr-eva-niyibizi",
    specialty: { fr: "Médecine Interne & d'Urgence", en: "Internal & Emergency Medicine" },
    description: { fr: "Médecin FMH, SSMUS et Médecin Consultante aux HUG.", en: "FMH, SSMUS Doctor and Consultant Doctor at HUG." },
    biography: { fr: "", en: "" }, // Fallback vazio pois usaremos o richBio
    richBio: {
      fr: {
        paragraphs: [
          { text: "Ancienne Cheffe de Clinique aux ", bold: "HUG", text2: " et actuellement Médecin Consultante aux urgences des HUG, la Dre Eva Niyibizi est titulaire d'une double spécialisation en médecine interne et médecine d'urgence." },
          { text: "Elle bénéficie de ", highlight: "plus de 10 ans d'expérience", text2: " clinique acquise aux HUG et a également exercé à la Clinique La Colline. Elle a complété sa formation à l'international (trauma fellowship à Jérusalem)." }
        ],
        bullets: [
          { label: "Intérêts", text: "Santé de la femme, soins de santé communautaires et accompagnement des populations sous-représentées." },
          { label: "Engagement", text: "MedFem, Onesimus, FeminEM, AfCEM." },
          { label: "Valeurs", text: "Inclusion, santé holistique, médecine personnalisée, flexibilité, respect et écoute." }
        ]
      },
      en: {
        paragraphs: [
          { text: "Former Head of Clinic at ", bold: "HUG", text2: " and currently Consultant Doctor in the HUG emergency department, Dr. Eva Niyibizi holds a dual specialization in internal medicine and emergency medicine." },
          { text: "She has ", highlight: "more than 10 years of experience", text2: " acquired at HUG and has also worked at Clinique La Colline. She completed part of her training internationally (trauma fellowship in Jerusalem)." }
        ],
        bullets: [
          { label: "Interests", text: "Women’s health, community healthcare, and underrepresented populations." },
          { label: "Engagement", text: "MedFem, Onesimus, FeminEM, AfCEM." },
          { label: "Values", text: "Inclusion, holistic health, personalized medicine, flexibility, respect, and attentive listening." }
        ]
      }
    },
    languages: ["Français", "English", "Hebrew", "Kinyarwanda"],
    image: IMAGES.drEva
  },
  {
    id: "doc2",
    name: "Dre. Carole Rabetokotany",
    email: "niyibizi@hin.ch", 
    role: "Médecin remplaçante (04.05.2026 - 31.10.2026)", 
    bookable: true,
    bookingMethod: "onedoc_or_phone",
    oneDocLink: "https://www.onedoc.ch/fr/medecin-generaliste/geneve/pc3sn/dr-carole-rabetokotany",
    widgetId: "3258cd330eb7a7f5a6bf944ac1f5e4f3828a34325c42a1a1384a4af6f51e854d",
    specialty: { fr: "FMH Médecin Praticienne", en: "FMH General Practitioner" },
    description: { fr: "Médecine intégrative, psychiatrie et micronutrition.", en: "Integrative medicine, psychiatry, and micronutrition." },
    biography: { fr: "", en: "" },
    richBio: {
      fr: {
        paragraphs: [
          { text: "Diplômée en médecine générale, en ", highlight: "micronutrition", text2: ", et dotée d'une expérience en psychiatrie et psychothérapie, la Dre Rabetokotany vous reçoit au cabinet médical du Seujet." },
          { text: "Nourrie par ses voyages et ses expériences à l'étranger, elle a développé une vision ouverte, globale et diversifiée de l’humain. Sa pratique allie la ", bold: "médecine allopathique", text2: " et la ", highlight: "médecine complémentaire", text2: "." }
        ],
        bullets: [
          { label: "Approche", text: "Médecine intégrative. Elle s’intéresse à l’individu dans son entièreté, en prenant pleinement en compte son contexte culturel." },
          { label: "Consultations", text: "Elle reçoit les enfants, adolescents et adultes dans une approche attentive et adaptée." }
        ]
      },
      en: {
        paragraphs: [
          { text: "Graduated in general medicine and ", highlight: "micronutrition", text2: ", with experience in psychiatry and psychotherapy, Dr. Rabetokotany welcomes you to the Seujet medical practice." },
          { text: "Enriched by her travels and experiences abroad, she has developed an open, global, and diversified vision of humanity. Her practice combines ", bold: "allopathic medicine", text2: " and ", highlight: "complementary medicine", text2: "." }
        ],
        bullets: [
          { label: "Approach", text: "Integrative medicine. She is interested in the individual as a whole, fully taking into account their cultural context." },
          { label: "Consultations", text: "She receives children, adolescents, and adults in an attentive and tailored approach." }
        ]
      }
    },
    languages: ["Français", "English", "Malgache"],
    image: IMAGES.drCarole
  },
  {
    id: "team1",
    name: "Dre. Karen Brechbühl",
    email: "niyibizi@hin.ch", 
    role: "Médecin", 
    bookable: true,
    bookingMethod: "phone_only",
    specialty: { fr: "Médecine Interne", en: "Internal Medicine" },
    description: { fr: "3ème année de résidanat (formation post-graduée).", en: "3rd year resident (post-graduate training)." },
    biography: { fr: "", en: "" },
    richBio: {
      fr: {
        paragraphs: [
          { text: "Médecin en formation postgraduée en ", bold: "troisième année de médecine interne", text2: ", je vous accueille en consultation avec écoute attentive, bienveillance et engagement." },
          { text: "Titulaire d'une formation médicale réalisée à l'étranger, j'évolue dans un ", highlight: "environnement multiculturel", text2: " et multilingue." }
        ],
        bullets: [
          { label: "Langues", text: "Je parle couramment le français, l'anglais et le portugais, et dispose de notions en roumain." }
        ]
      },
      en: {
        paragraphs: [
          { text: "A doctor in postgraduate training in my ", bold: "third year of internal medicine", text2: ", I welcome you in consultation with attentive listening, kindness, and commitment." },
          { text: "Holding a medical degree obtained abroad, I thrive in a ", highlight: "multicultural environment", text2: " that is also multilingual." }
        ],
        bullets: [
          { label: "Languages", text: "I fluently speak French, English, and Portuguese, and have some notions of Romanian." }
        ]
      }
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
    description: { fr: "Le cœur battant du cabinet avec une gestion humaine et rigoureuse.", en: "The beating heart of the clinic with humane and rigorous management." },
    biography: { fr: "", en: "" },
    richBio: {
      fr: {
        paragraphs: [
          { text: "Assistante médicale dévouée avec une ", highlight: "riche expérience", text2: " dans la gestion et l'accompagnement des patients." },
          { text: "", bold: "Véritable pilier du cabinet", text2: ", Lucienne assure le bon déroulement des consultations et la réalisation des examens techniques (prises de sang, ECG, etc.) avec douceur et professionnalisme." },
          { text: "Son approche humaine et sa rigueur garantissent un accueil chaleureux et sécurisant pour chaque personne franchissant les portes du cabinet.", bold: "", text2: "" }
        ]
      },
      en: {
        paragraphs: [
          { text: "A dedicated medical assistant with ", highlight: "rich experience", text2: " in patient management and support." },
          { text: "", bold: "A true pillar of the practice", text2: ", Lucienne ensures the smooth running of consultations and technical exams (blood tests, ECGs, etc.) with gentleness and professionalism." },
          { text: "Her human approach and rigor guarantee a warm and secure welcome for everyone walking through the clinic doors.", bold: "", text2: "" }
        ]
      }
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
  fax: "+41 22 700 70 72",
  oneDocUrl: "https://www.onedoc.ch/en/general-practitioner-gp/geneva/pbqre/dr-eva-niyibizi",
  labPartners: ["Viollier", "Unilabs", "Dianalabs", "MGD"],
  paymentInfo: {
    fr: "Paiement par carte ou directement auprès de l’assurance maladie.",
    en: "Payment by card or directly through health insurance."
  },
  bookingInfo: {
    fr: "La prise de rendez-vous est possible directement via OneDoc. Le cabinet informe actuellement ne plus pouvoir accepter de nouveaux patients avant janvier 2027.",
    en: "Appointments can be booked directly via OneDoc. The clinic informs that it is currently unable to accept new patients before January 2027."
  },
  accessibilityInfo: {
    fr: "Accès PMR et transports publics à proximité (bus / tram).",
    en: "PMR access and nearby public transport (bus / tram)."
  },
  inclusionInfo: {
    fr: "Tous les patients sont les bienvenus pour parler de leur santé dans un environnement respectueux et déontologique, sans distinction de race, de genre, d'orientation religieuse ou sexuelle.",
    en: "All patients are welcome to discuss their health in a respectful and deontological environment without distinction of race, gender, religious or sexual orientation."
  },
  email: "niyibizi@hin.ch", 
  mapEmbedUrl: "https://maps.google.com/maps?q=Quai+du+Seujet+14,+1201+Genève&t=&z=15&ie=UTF8&iwloc=&output=embed",
  openingHours: "Lun-Ven: 08:00 - 18:00",
  emergencyInfo: "En cas d'urgence vitale, composez le 144.",
  policies: "Annulation 24h à l'avance.",
  features: [
    { fr: "Toute personne est soignée sans discrimination d'ethnie, de sexe, de religion, d'orientation sexuelle.", en: "Every person is treated without discrimination based on ethnicity, gender, religion, sexual orientation." }
  ]
};

export const TESTIMONIALS = [
  { name: "Natalia Matveeva", text: { fr: "La Dre Niyibizi est extrêmement professionnelle, expérimentée, empathique.", en: "Dr. Niyibizi is extremely professional, experienced, empathetic." }, rating: 5 },
  { name: "Noémie H", text: { fr: "Une médecin absolument remarquable. Compétente, très proactive.", en: "An absolutely remarkable doctor. Competent, very proactive." }, rating: 5 },
  { name: "Laura Spendolini", text: { fr: "Médecin très professionnelle, à l'écoute de ses patients.", en: "Very professional doctor, attentive to her patients." }, rating: 5 },
  { name: "Flurin Ryffel", text: { fr: "Extrêmement compétente et professionnelle.", en: "Extremely competent and professional." }, rating: 5 },
  { name: "Nicolas Blanchet", text: { fr: "Attentive, minutieuse et professionnelle.", en: "Attentive, thorough, and professional." }, rating: 5 }
];