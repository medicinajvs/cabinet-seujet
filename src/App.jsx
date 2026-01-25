import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, Phone, Mail, MapPin, 
  User, ExternalLink, ChevronUp, ChevronDown, MessageCircle, FileText, Lock, Save, Edit3, Globe, Heart, CheckCircle, ArrowRight, ArrowLeft
} from 'lucide-react';
import { 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, db, googleProvider, appId } from './config/firebase';
import { DEFAULT_SERVICES, DEFAULT_DOCTORS, DEFAULT_CLINIC_INFO, TRANSLATIONS, IMAGES, TESTIMONIALS } from './data/constants';
import { getStatusLabel } from './utils/helpers';
import { useAppointments } from './hooks/useAppointments';

import LoadingScreen from './components/ui/LoadingScreen';
import Modal from './components/ui/Modal';
import IconMapper from './components/ui/IconMapper';
import BookingWizard from './components/features/BookingWizard';
import ProfileEditor from './components/features/ProfileEditor';
import AppointmentChat from './components/features/AppointmentChat';
import DashboardView from './components/dashboard/DashboardView';

const App = () => {
  const [lang, setLang] = useState('fr'); 
  const t = TRANSLATIONS[lang]; 

  const [bgColorClass, setBgColorClass] = useState('bg-[#e0f2f1]');

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [clinicData, setClinicData] = useState(DEFAULT_CLINIC_INFO);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS);
  
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [doctorsLoaded, setDoctorsLoaded] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  
  const [selectedAppointment, setSelectedAppointment] = useState(null); 
  const [privateDetails, setPrivateDetails] = useState(null); 
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const [openBios, setOpenBios] = useState({}); 
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const isDoctor = !!(user && doctorsLoaded && doctors.some(d => d.email === user.email && d.role === "Médecin Responsable"));
  const readyToFetch = authInitialized && profileLoaded && doctorsLoaded;
  
  const { appointments } = useAppointments(user, isDoctor, readyToFetch);

  const toggleBio = (id) => {
    setOpenBios(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleScrollColor = () => {
      const position = window.scrollY;
      setScrolled(position > 50);
      if (position < 700) {
        setBgColorClass('bg-[#e0f2f1]'); 
      } else if (position >= 700 && position < 2000) {
        setBgColorClass('bg-white'); 
      } else {
        setBgColorClass('bg-[#C6A591]'); 
      }
    };
    window.addEventListener('scroll', handleScrollColor);
    return () => window.removeEventListener('scroll', handleScrollColor);
  }, []);

  // --- Efeitos de Dados ---
  useEffect(() => {
    if (selectedAppointment) {
      setLoadingDetails(true);
      setPrivateDetails(null);
      setIsEditingNotes(false);
      const fetchPrivateData = async () => {
        try {
          const docRef = doc(db, 'artifacts', appId, 'private', 'medical_records', selectedAppointment.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPrivateDetails(data);
            setNoteContent(data.doctorInternalNotes || "");
          } else {
            setPrivateDetails(null);
            setNoteContent("");
          }
        } catch (err) { console.log("Sem permissão."); } finally { setLoadingDetails(false); }
      };
      fetchPrivateData();
    }
  }, [selectedAppointment]);

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'private', 'medical_records', selectedAppointment.id);
      await updateDoc(docRef, { doctorInternalNotes: noteContent, updatedAt: serverTimestamp() });
      setPrivateDetails(prev => ({...prev, doctorInternalNotes: noteContent}));
      setIsEditingNotes(false);
      alert("Note sauvegardée !");
    } catch (error) { alert("Erreur: " + error.message); }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous) {
          const userDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid);
          onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) setUserData(docSnap.data());
            setProfileLoaded(true);
          }, () => setProfileLoaded(true));
      } else {
        if (!currentUser) signInAnonymously(auth).catch(console.error);
        setProfileLoaded(true);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authInitialized || !user) return;
    const doctorsCol = collection(db, 'artifacts', appId, 'public', 'data', 'doctors');
    const clinicDoc = doc(db, 'artifacts', appId, 'public', 'data', 'clinic', 'main');
    const unsubDocs = onSnapshot(doctorsCol, (snap) => {
      if (!snap.empty) setDoctors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDoctorsLoaded(true);
    }, () => setDoctorsLoaded(true));
    const unsubClinic = onSnapshot(clinicDoc, (snap) => { if(snap.exists()) setClinicData(snap.data()); });
    return () => { unsubDocs(); unsubClinic(); };
  }, [authInitialized, user]);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'appointments', apptId), { status: newStatus, updatedAt: serverTimestamp() });
    } catch (error) { alert("Action bloquée."); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthSuccess("");
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        await sendEmailVerification(cred.user);
        try { await setDoc(doc(db, 'artifacts', appId, 'users', cred.user.uid), { email: email, createdAt: serverTimestamp() }); } catch (err) {}
        setAuthSuccess("Vérifiez votre email!"); setTimeout(() => setShowAuthModal(false), 3000);
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setAuthSuccess("Email envoyé."); setTimeout(() => setAuthMode('login'), 3000);
      }
    } catch (err) { setAuthError(err.message.replace("Firebase: ", "")); }
  };

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const handleScroll = (e) => setScrolled(e.target.scrollTop > 50);

  if (!authInitialized) return <LoadingScreen />;

  return (
    <div className={`font-sans text-gray-700 relative h-full transition-colors duration-1000 ease-in-out ${bgColorClass}`}>
      
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button onClick={() => setLang('fr')} className={`px-3 py-1 rounded-full shadow-lg border font-bold transition ${lang === 'fr' ? 'bg-[#008080] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>FR</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full shadow-lg border font-bold transition ${lang === 'en' ? 'bg-[#008080] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>EN</button>
      </div>

      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Nouveau Rendez-vous">
         <BookingWizard doctors={doctors} user={user} onClose={() => { setShowBookingModal(false); setShowDashboard(true); }} lang={lang} />
      </Modal>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title={authMode === 'login' ? "Connexion" : "Compte"}>
          <form onSubmit={handleAuth} className="space-y-4">
            {authError && <div className="bg-red-50 text-red-600 p-3 text-sm rounded">{authError}</div>}
            {authSuccess && <div className="bg-green-50 text-green-600 p-3 text-sm rounded">{authSuccess}</div>}
            {authMode === 'signup' && (
              <input type="text" placeholder="Nom Complet" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 border rounded text-gray-900 bg-white" />
            )}
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded text-gray-900 bg-white" />
            {authMode !== 'reset' && (
              <input type="password" placeholder="Mot de passe" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded text-gray-900 bg-white" />
            )}
            <button type="submit" className="w-full bg-[#008080] text-white py-3 rounded-lg font-bold hover:bg-[#006666]">
              {authMode === 'login' ? "Se connecter" : (authMode === 'signup' ? "S'inscrire" : "Envoyer")}
            </button>
            <button type="button" onClick={() => signInWithPopup(auth, googleProvider).then(() => setShowAuthModal(false))} className="w-full border p-3 rounded flex justify-center items-center gap-2 hover:bg-gray-50 bg-white">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="font-bold text-gray-600">Google</span>
            </button>
            <div className="text-center text-sm space-y-2 mt-4">
              {authMode === 'login' && (
                <>
                  <button type="button" onClick={() => setAuthMode('reset')} className="text-gray-500 underline">Mot de passe oublié ?</button>
                  <p>Pas encore de compte ? <button type="button" onClick={() => setAuthMode('signup')} className="text-[#008080] font-bold">S'inscrire</button></p>
                </>
              )}
              {authMode === 'signup' && <button type="button" onClick={() => setAuthMode('login')} className="text-[#008080] font-bold">Se connecter</button>}
              {authMode === 'reset' && <button type="button" onClick={() => setAuthMode('login')} className="text-[#008080] font-bold">Retour</button>}
            </div>
          </form>
      </Modal>

      {showDashboard && user && !user.isAnonymous ? (
        <div className="scroll-container" onScroll={handleScroll}>
            <DashboardView user={user} userData={userData} isDoctor={isDoctor} appointments={appointments} onClose={() => setShowDashboard(false)} onEditProfile={() => setShowProfileEdit(true)} onBookNew={() => setShowBookingModal(true)} onViewAppointment={(appt) => setSelectedAppointment(appt)} />
        </div>
      ) : (
        <div className="scroll-container" onScroll={handleScroll}>
           
           <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2 top-0' : 'bg-transparent py-4 top-0'}`}>
              <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-6 h-6 ${scrolled ? 'text-[#008080]' : 'text-white drop-shadow-md'}`} />
                  <span className={`text-xl font-bold tracking-wide ${scrolled ? 'text-gray-800' : 'text-white drop-shadow-md'}`}>CABINET DU SEUJET</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#home" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#008080]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>{t.nav.home}</a>
                  <a href="#about" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#008080]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>{t.nav.team}</a>
                  <a href="#clinic" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#008080]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>{t.nav.clinic}</a>
                  
                  {user && !user.isAnonymous ? (
                    <button onClick={() => setShowDashboard(true)} className="flex items-center gap-2 font-bold text-[#008080] bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"><User size={18} /> {t.nav.mySpace}</button>
                  ) : (
                    <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className={`font-medium flex items-center gap-1 transition-colors ${scrolled ? 'text-gray-600 hover:text-[#008080]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}><User size={18} /> {t.nav.login}</button>
                  )}
                  <button onClick={() => setShowBookingModal(true)} className={`${scrolled ? 'bg-[#008080] text-white' : 'bg-white text-[#008080]'} px-5 py-2 rounded-full font-semibold transition hover:shadow-lg flex items-center gap-2`}>{t.nav.book}</button>
                </div>
                <div className="md:hidden">
                   <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${scrolled ? 'text-gray-800' : 'text-white'}`}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
                </div>
              </div>
              {isMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-6 flex flex-col space-y-4 border-t text-gray-800">
                  <a href="#home" className="font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
                  <a href="#about" className="font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.team}</a>
                  <a href="#clinic" className="font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.clinic}</a>
                  <button onClick={() => { setShowBookingModal(true); setIsMenuOpen(false); }} className="bg-[#008080] text-white py-2 rounded text-center">{t.nav.book}</button>
                </div>
              )}
           </nav>

           <section id="home" className="relative min-h-[100vh] w-full max-w-full overflow-hidden flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url("${IMAGES.heroBg}")`}}>
             <div className="absolute inset-0 bg-gradient-to-r from-[#004d4d]/90 to-[#008080]/70"></div>
             <div className="relative container mx-auto px-6 text-center text-white pt-16">
               <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif drop-shadow-md">{t.hero.title}</h1>
               <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light drop-shadow-sm">{t.hero.subtitle}</p>
               <div className="flex justify-center gap-4">
                 <button onClick={() => setShowBookingModal(true)} className="bg-white text-[#008080] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2">{t.hero.cta}</button>
               </div>
               <div className="mt-12 flex flex-col md:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 items-center">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/30 text-white">
                    <Heart className="text-pink-300 fill-pink-300" size={16} />
                    <span>LGBTQ+ Friendly</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/30 text-white">
                    <Globe size={16} />
                    <span>FR / EN</span>
                  </div>
               </div>
             </div>
           </section>

           <section id="clinic" className="py-20 w-full max-w-full overflow-hidden transition-colors duration-500">
             <div className="container mx-auto px-6">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif mb-4 relative inline-block">
                     {t.clinic.title}
                     <div className="w-1/2 h-1 bg-[#008080] absolute -bottom-2 left-0"></div>
                  </h2>
                  <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
                     <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-600"/> {t.clinic.inclusivity}</span>
                     <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-600"/> {t.clinic.accessibility}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                   <p className="text-gray-600 text-lg leading-relaxed">{clinicData?.description[lang]}</p>
                   <div className="grid grid-cols-2 gap-4">
                      <img src={IMAGES.clinic1} className="rounded-xl shadow-md h-40 w-full object-cover hover:scale-105 transition duration-500" alt="Clinic 1" />
                      <img src={IMAGES.clinic2} className="rounded-xl shadow-md h-40 w-full object-cover hover:scale-105 transition duration-500" alt="Clinic 2" />
                      <div className="col-span-2">
                        <img src={IMAGES.clinic3} className="rounded-xl shadow-md h-48 w-full object-cover hover:scale-105 transition duration-500" alt="Clinic 3" />
                      </div>
                   </div>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-700"><MapPin className="text-[#008080]" /> <span>{clinicData?.address}</span></li>
                            <li className="flex items-center gap-3 text-gray-700"><Phone className="text-[#008080]" /> <span>{clinicData?.phone}</span></li>
                            <li className="flex items-center gap-3 text-gray-700"><Mail className="text-[#008080]" /> <span>{clinicData?.email}</span></li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-2">Accessibilité</h4>
                            <div className="flex flex-wrap gap-2">
                                {clinicData.features.map((feat, idx) => (
                                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{feat[lang]}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                        <iframe src={clinicData?.mapEmbedUrl} width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                    </div>
                 </div>
               </div>
             </div>
           </section>

           <section id="about" className="py-20 w-full max-w-full overflow-hidden">
             <div className="container mx-auto px-6">
               <div className="text-center mb-16 relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">{t.doctors.title}</h2>
                  <div className="w-20 h-1 bg-[#008080] mx-auto mt-4"></div>
               </div>
               
               {/* FIX: 'items-start' impede que todos estiquem quando um abre */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {doctors.map((doc, idx) => (
                    <div key={doc.id || idx} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col">
                      <div className="h-64 overflow-hidden relative group">
                          <img src={doc.image || "https://via.placeholder.com/150"} alt={doc.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition"></div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800">{doc.name}</h3>
                        <p className="text-[#008080] font-medium text-sm uppercase tracking-wide mb-1">{doc.role}</p>
                        <p className="text-gray-500 font-medium text-xs mb-2">{doc.specialty[lang]}</p>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{doc.description[lang]}</p>
                        
                        <div className="flex gap-1 mb-4 flex-wrap">
                           {doc.languages && doc.languages.map(l => (
                             <span key={l} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{l}</span>
                           ))}
                        </div>

                        <div className="mt-auto space-y-3">
                           <div className="border-t border-gray-100 pt-3">
                             <button 
                               onClick={() => toggleBio(doc.id)}
                               className="flex items-center justify-between w-full text-sm font-bold text-gray-700 hover:text-[#008080]"
                             >
                               {t.doctors.bio}
                               {openBios[doc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                             </button>
                             {openBios[doc.id] && (
                               <div className="mt-2 text-sm text-gray-600 animate-in slide-in-from-top-2 bg-gray-50 p-3 rounded text-justify">
                                 {doc.biography[lang] || "Biographie détaillée indisponible."}
                               </div>
                             )}
                           </div>

                           {doc.bookable && (
                             <div className="flex gap-2">
                               <button className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm font-bold hover:bg-gray-50 transition">
                                 {t.doctors.contact}
                               </button>
                               <button onClick={() => setShowBookingModal(true)} className="flex-1 bg-[#008080] text-white py-2 rounded text-sm font-bold hover:bg-[#006666] transition">
                                 {t.doctors.book}
                               </button>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
           </section>

           <section id="testimonials" className="py-20 w-full max-w-full overflow-hidden">
              <div className="container mx-auto px-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div>
                       <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl mb-4">
                          {t.testimonials.title}, <br/> {t.testimonials.subtitle}
                       </h2>
                       <div className="flex gap-4 mt-8">
                          <button onClick={prevTestimonial} className="p-3 rounded-full border border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition"><ArrowLeft size={20}/></button>
                          <button onClick={nextTestimonial} className="p-3 rounded-full border border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition"><ArrowRight size={20}/></button>
                       </div>
                    </div>
                    <div className="lg:col-span-2">
                       <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 relative min-h-[250px] flex flex-col justify-between transition-all duration-300">
                          <div>
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                   <h4 className="text-xl font-bold text-gray-800">{TESTIMONIALS[currentTestimonial].name}</h4>
                                   <div className="flex text-yellow-400 mt-1">
                                      {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => <span key={i}>★</span>)}
                                   </div>
                                </div>
                                <span className="text-4xl text-[#008080] opacity-20 font-serif">"</span>
                             </div>
                             <p className="text-gray-600 italic leading-relaxed text-lg">
                                {TESTIMONIALS[currentTestimonial].text[lang]}
                             </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-6 text-right">Google Reviews</p>
                       </div>
                    </div>
                 </div>
              </div>
           </section>

           <section id="services" className="py-20 w-full max-w-full overflow-hidden">
             <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">{t.services.title}</h2>
                 <div className="w-20 h-1 bg-[#008080] mx-auto mt-4"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {services.map((service, index) => (
                   <div key={index} className="p-8 border border-gray-100 rounded-xl hover:shadow-xl transition duration-300 bg-white/90 backdrop-blur-sm group">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-[#008080] mb-6 group-hover:bg-[#008080] group-hover:text-white transition duration-300">
                       <IconMapper type={service.iconType} className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title[lang]}</h3>
                     <p className="text-gray-600 leading-relaxed">{service.description[lang]}</p>
                   </div>
                 ))}
               </div>
             </div>
           </section>

           <footer className="bg-gray-900 text-white pt-16 pb-24 w-full max-w-full overflow-hidden">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                   <div>
                     <h3 className="text-2xl font-serif font-bold mb-4">Cabinet du Seujet</h3>
                     <p className="text-gray-400 mb-4">Genève, Suisse</p>
                   </div>
                   
                   <div>
                     <h4 className="font-bold mb-4">{t.footer.quickLinks}</h4>
                     <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#home" className="hover:text-white">{t.nav.home}</a></li>
                        <li><a href="#about" className="hover:text-white">{t.nav.team}</a></li>
                        <li><a href="#clinic" className="hover:text-white">{t.nav.clinic}</a></li>
                        <li><button onClick={() => setShowBookingModal(true)} className="hover:text-white text-left">{t.nav.book}</button></li>
                        <li className="pt-2">
                           <span className="flex items-center gap-2 text-xs text-gray-400 border border-gray-700 px-3 py-2 rounded-full w-fit">
                             <Heart size={10} className="text-pink-500"/> LGBTQ+ Safe Space
                           </span>
                        </li>
                     </ul>
                   </div>

                   <div>
                     <h4 className="font-bold mb-4">{t.footer.contact}</h4>
                     <p className="text-gray-400 text-sm">Quai du Seujet 14</p>
                     <p className="text-gray-400 text-sm">+41 22 700 70 70</p>
                   </div>

                   <div>
                     <h4 className="font-bold mb-4">Legal</h4>
                     <a href="#" className="block text-gray-400 text-sm hover:text-white mb-2">Mentions Légales</a>
                     <a href="#" className="block text-gray-400 text-sm hover:text-white">{t.footer.privacy}</a>
                   </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 flex justify-between">
                   <span>© 2025 Cabinet du Seujet. {t.footer.rights}</span>
                </div>
              </div>
           </footer>
        </div>
      )}
    </div>
  );
};

export default App;