import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, Phone, Mail, MapPin, 
  User, ExternalLink, ChevronUp, ChevronDown, MessageCircle, FileText, Lock, Save, Edit3, Globe, Heart, CheckCircle, ArrowRight, ArrowLeft, BookOpen, Star, Activity, Monitor
} from 'lucide-react';
import { 
  signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, setPersistence, browserLocalPersistence
} from 'firebase/auth';
import { collection, onSnapshot, updateDoc, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db, googleProvider, appId } from './config/firebase';
import { 
  DEFAULT_SERVICES, DEFAULT_DOCTORS, DEFAULT_CLINIC_INFO, TRANSLATIONS, IMAGES, 
  TESTIMONIALS, CLINIC_VALUES, TEACHING_INFO, TECHNICAL_PLATFORM, COMMUNITY_ENGAGEMENTS 
} from './data/constants';
import { getStatusLabel } from './utils/helpers';
import { useAppointments } from './hooks/useAppointments';

import LoadingScreen from './components/ui/LoadingScreen';
import Modal from './components/ui/Modal';
import IconMapper from './components/ui/IconMapper';
import BookingWizard from './components/features/BookingWizard';
import ProfileEditor from './components/features/ProfileEditor';
import DashboardView from './components/dashboard/DashboardView';

const App = () => {
  const [lang, setLang] = useState('fr'); 
  const t = TRANSLATIONS[lang]; 
  const [bgColorClass, setBgColorClass] = useState('bg-gray-50'); 
  const [selectedImage, setSelectedImage] = useState(null);

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
  const [openBios, setOpenBios] = useState({}); 
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const isDoctor = !!(user && doctorsLoaded && doctors.some(d => d.email === user.email && d.role === "Médecin Cheffe"));
  const readyToFetch = authInitialized && profileLoaded && doctorsLoaded;
  
  // Hook que carrega o histórico
  const { appointments } = useAppointments(user, isDoctor, readyToFetch);

  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['fr'] || "";
  };

  const toggleBio = (id) => setOpenBios(prev => ({ ...prev, [id]: !prev[id] }));

  // Scroll Color
  useEffect(() => {
    const handleScrollColor = () => {
      const position = window.scrollY;
      setScrolled(position > 50);
      if (position < 700) setBgColorClass('bg-gray-50'); 
      else if (position >= 700 && position < 2500) setBgColorClass('bg-white');   
      else setBgColorClass('bg-[#C6A591]'); 
    };
    window.addEventListener('scroll', handleScrollColor);
    return () => window.removeEventListener('scroll', handleScrollColor);
  }, []);

  // Auth e UserData (CAMINHO SIMPLIFICADO: 'users')
  useEffect(() => {
    const initAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser && !currentUser.isAnonymous) {
            // LÊ DA COLEÇÃO RAIZ 'users'
            const userDocRef = doc(db, 'users', currentUser.uid);
            onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) setUserData(docSnap.data());
              setProfileLoaded(true);
            });
        } else {
          setUserData(null);
          setProfileLoaded(true);
        }
        setAuthInitialized(true);
      });
      return unsubscribe;
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!authInitialized) return;
    const doctorsCol = collection(db, 'artifacts', appId, 'public', 'data', 'doctors');
    const unsubDocs = onSnapshot(doctorsCol, (snap) => {
      if (!snap.empty) setDoctors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDoctorsLoaded(true);
    }, () => setDoctorsLoaded(true));
    return () => unsubDocs();
  }, [authInitialized]);

  const onLoginSuccess = () => {
    setShowAuthModal(false);
    setShowDashboard(true);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthSuccess("");
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
      } else if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        await sendEmailVerification(cred.user);
        // Criação no caminho simplificado 'users'
        try { await setDoc(doc(db, 'users', cred.user.uid), { email: email, createdAt: serverTimestamp() }); } catch (err) {}
        setAuthSuccess("Vérifiez votre email!"); setTimeout(onLoginSuccess, 1500);
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setAuthSuccess("Email envoyé."); setTimeout(() => setAuthMode('login'), 3000);
      }
    } catch (err) { setAuthError(err.message.replace("Firebase: ", "")); }
  };

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  if (!authInitialized) return <LoadingScreen />;

  const DoctorCard = ({ doc }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col hover:border-[#800020]">
      <div className="h-64 overflow-hidden relative group">
          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#800020]">{doc.name}</h3>
        <p className="text-[#800020] font-medium text-sm uppercase tracking-wide mb-1">{doc.role}</p>
        <p className="text-gray-500 font-medium text-sm mb-3">{getText(doc.specialty)}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{getText(doc.description)}</p>
        
        <div className="flex gap-1 mb-4 flex-wrap">
           {doc.languages && doc.languages.map(l => (
             <span key={l} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">{l}</span>
           ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
            <button onClick={() => toggleBio(doc.id)} className="flex items-center justify-between w-full text-sm font-bold text-gray-700 hover:text-[#800020] mb-3">
               {t.doctors.bio}
               {openBios[doc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openBios[doc.id] && (
               <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-3 text-justify animate-in fade-in">
                 {getText(doc.biography)}
               </div>
            )}
            
            {doc.bookable && (
                <button onClick={() => setShowBookingModal(true)} className="w-full bg-[#800020] text-white py-2 rounded text-sm font-bold hover:bg-[#600015] transition">
                    {t.doctors.book}
                </button>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`font-sans text-gray-700 relative h-full transition-colors duration-1000 ease-in-out ${bgColorClass}`}>
      
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button onClick={() => setLang('fr')} className={`px-4 py-2 rounded-full shadow-lg border-2 font-bold transition ${lang === 'fr' ? 'bg-[#800020] text-white border-[#800020]' : 'bg-white text-gray-900 border-gray-400'}`}>FR</button>
        <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-full shadow-lg border-2 font-bold transition ${lang === 'en' ? 'bg-[#800020] text-white border-[#800020]' : 'bg-white text-gray-900 border-gray-400'}`}>EN</button>
      </div>

      {selectedImage && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
              <img src={selectedImage} className="max-w-full max-h-[90vh] rounded shadow-2xl" />
              <button className="absolute top-4 right-4 text-white"><X size={32}/></button>
          </div>
      )}

      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Rendez-vous">
         <BookingWizard doctors={doctors} user={user} onClose={() => setShowBookingModal(false)} lang={lang} />
      </Modal>

      <Modal isOpen={showProfileEdit} onClose={() => setShowProfileEdit(false)} title="Modifier mon profil">
         <ProfileEditor user={user} userData={userData} onClose={() => setShowProfileEdit(false)} />
      </Modal>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title={authMode === 'login' ? "Connexion" : "Compte"}>
          <form onSubmit={handleAuth} className="space-y-4">
             {authError && <div className="text-red-500 text-sm">{authError}</div>}
             <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded"/>
             <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 border rounded"/>
             <button type="submit" className="w-full bg-[#800020] text-white py-3 rounded font-bold hover:bg-[#600015] transition">Entrer</button>
             
             <button type="button" onClick={() => signInWithPopup(auth, googleProvider).then(onLoginSuccess)} className="w-full border p-3 rounded flex justify-center items-center gap-3 hover:bg-gray-50 bg-white transition shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="font-bold text-gray-600">Google</span>
            </button>

             <div className="text-center text-sm space-y-2 mt-4">
              {authMode === 'login' && <button type="button" onClick={() => setAuthMode('signup')} className="text-[#800020] font-bold hover:underline">S'inscrire</button>}
              {authMode === 'signup' && <button type="button" onClick={() => setAuthMode('login')} className="text-[#800020] font-bold hover:underline">Se connecter</button>}
            </div>
          </form>
      </Modal>

      {showDashboard && user ? (
        <DashboardView 
          user={user} 
          userData={userData} 
          isDoctor={isDoctor} 
          appointments={appointments} 
          onClose={() => setShowDashboard(false)} 
          onEditProfile={() => setShowProfileEdit(true)} 
          onBookNew={() => setShowBookingModal(true)} 
          lang={lang}
        />
      ) : (
        <div className="scroll-container" onScroll={(e) => setScrolled(e.target.scrollTop > 50)}>
           
           <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
              <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold tracking-wide ${scrolled ? 'text-[#800020]' : 'text-white drop-shadow-md'}`}>CABINET DU SEUJET</span>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  {['home', 'mission', 'team', 'clinic'].map(item => (
                      <a key={item} href={`#${item}`} className={`font-medium text-sm uppercase tracking-wider ${scrolled ? 'text-gray-600 hover:text-[#800020]' : 'text-white hover:text-gray-200 shadow-sm'}`}>{t.nav[item]}</a>
                  ))}
                  
                  {user ? (
                    <button onClick={() => setShowDashboard(true)} className="flex items-center gap-2 font-bold text-[#800020] bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"><User size={18} /> {t.nav.mySpace}</button>
                  ) : (
                    <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className={`font-bold text-sm ${scrolled ? 'text-[#800020]' : 'text-white'}`}>{t.nav.login}</button>
                  )}
                  
                  <button onClick={() => setShowBookingModal(true)} className="bg-[#800020] text-white px-5 py-2 rounded-full font-bold shadow hover:bg-[#600018] transition">{t.nav.book}</button>
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden ${scrolled ? 'text-[#800020]' : 'text-white'}`}><Menu /></button>
              </div>
              
              {isMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl py-4 px-6 flex flex-col space-y-4 border-t border-gray-100 text-gray-800">
                  <a href="#home" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
                  <a href="#mission" onClick={() => setIsMenuOpen(false)}>{t.nav.mission}</a>
                  <a href="#team" onClick={() => setIsMenuOpen(false)}>{t.nav.team}</a>
                  <button onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }} className="text-left font-bold text-[#800020]">{t.nav.login}</button>
                  <button onClick={() => { setShowBookingModal(true); setIsMenuOpen(false); }} className="bg-[#800020] text-white py-3 rounded text-center w-full">{t.nav.book}</button>
                </div>
              )}
           </nav>

           <section id="home" className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url("${IMAGES.heroBg}")`}}>
             <div className="absolute inset-0 bg-[#800020]/20 mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
             <div className="relative container mx-auto px-6 text-center text-white pt-20">
               <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif drop-shadow-lg">{t.hero.title}</h1>
               <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">{t.hero.subtitle}</p>
               
               <div className="mb-8 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/30 text-white">
                    <Globe size={16} />
                    <span>FR / EN / PT / HE / RO / RW</span>
                  </div>
               </div>

               <button onClick={() => setShowBookingModal(true)} className="bg-[#800020] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#600018] transition shadow-xl">{t.hero.cta}</button>
             </div>
           </section>

           <section id="mission" className="py-20 bg-white">
               <div className="container mx-auto px-6">
                   <div className="text-center mb-16">
                       <h2 className="text-3xl font-bold text-[#800020] mb-4">{t.sections.mission}</h2>
                       <div className="flex flex-wrap justify-center gap-6 mt-8">
                           {CLINIC_VALUES.map((val, idx) => (
                               <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm text-gray-700 font-medium">
                                   <IconMapper type={val.icon} className="text-[#800020] w-5 h-5"/> {getText(val.title)}
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                       <div>
                           <h3 className="text-xl font-bold text-[#800020] mb-4 flex items-center gap-2"><BookOpen/> {t.sections.teaching}</h3>
                           <h4 className="font-bold text-gray-800 mb-2">{getText(TEACHING_INFO.title)}</h4>
                           <p className="text-gray-700 leading-relaxed text-lg">{getText(TEACHING_INFO.description)}</p>
                           <div className="mt-6 flex flex-wrap gap-2">
                               <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-gray-600">UNIGE</span>
                               <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-gray-600">2ème Bachelor</span>
                               <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-gray-600">3ème Master</span>
                           </div>
                       </div>
                       <div>
                           <h3 className="text-xl font-bold text-[#800020] mb-4 flex items-center gap-2"><Heart/> {t.sections.community}</h3>
                           <div className="flex flex-wrap gap-3">
                               {COMMUNITY_ENGAGEMENTS.map(eng => (
                                   <span key={eng} className="bg-[#800020] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">{eng}</span>
                               ))}
                               <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">MEDIX</span>
                           </div>
                       </div>
                   </div>
               </div>
           </section>

           <section id="team" className="py-20 bg-gray-50">
             <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-[#800020] mb-2">{t.doctors.title}</h2>
                  <div className="w-20 h-1 bg-gray-300 mx-auto"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
               </div>
             </div>
           </section>

           <section id="clinic" className="py-20 bg-white">
               <div className="container mx-auto px-6">
                   <h2 className="text-3xl font-bold text-center text-[#800020] mb-16">{t.sections.services} & {t.sections.equipment}</h2>
                   <div className="grid md:grid-cols-3 gap-8 mb-20">
                       {DEFAULT_SERVICES.map((s, i) => (
                           <div key={i} className="p-6 border border-gray-100 rounded-xl hover:border-[#800020] transition group bg-white shadow-sm">
                               <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-[#800020] mb-4 group-hover:bg-[#800020] group-hover:text-white transition">
                                   <IconMapper type={s.iconType} />
                               </div>
                               <h4 className="font-bold text-lg mb-2">{getText(s.title)}</h4>
                               <p className="text-sm text-gray-600">{getText(s.description)}</p>
                           </div>
                       ))}
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                       <div className="space-y-8">
                           <div>
                               <h3 className="font-bold text-xl text-[#800020] border-b pb-3 mb-6 flex items-center gap-2">
                                 <Monitor size={24}/> {t.sections.equipment}
                               </h3>
                               <ul className="space-y-4">
                                   {TECHNICAL_PLATFORM.equipment.map((eq, i) => (
                                       <li key={i} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                         <Activity size={20} className="text-[#800020]"/> {getText(eq)}
                                       </li>
                                   ))}
                               </ul>
                           </div>
                           <div>
                               <h3 className="font-bold text-xl text-[#800020] border-b pb-3 mb-6 flex items-center gap-2">
                                 <CheckCircle size={24}/> {t.sections.care}
                               </h3>
                               <ul className="space-y-3">
                                   {TECHNICAL_PLATFORM.careRoom.map((cr, i) => (
                                       <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                                         <div className="w-2 h-2 rounded-full bg-[#800020]"></div> {getText(cr)}
                                       </li>
                                   ))}
                               </ul>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <img src={IMAGES.clinic1} onClick={() => setSelectedImage(IMAGES.clinic1)} className="rounded-lg shadow-md cursor-pointer hover:opacity-90 transition h-40 w-full object-cover" />
                           <img src={IMAGES.clinic2} onClick={() => setSelectedImage(IMAGES.clinic2)} className="rounded-lg shadow-md cursor-pointer hover:opacity-90 transition h-40 w-full object-cover" />
                           <img src={IMAGES.clinic3} onClick={() => setSelectedImage(IMAGES.clinic3)} className="col-span-2 rounded-lg shadow-md cursor-pointer hover:opacity-90 transition h-48 w-full object-cover" />
                       </div>
                   </div>
               </div>
           </section>

           <footer className="bg-gray-900 text-white pt-16 pb-8 w-full max-w-full overflow-hidden">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div>
                     <h3 className="text-2xl font-serif font-bold mb-4">Cabinet du Seujet</h3>
                     <p className="text-gray-400 mb-4">Quai du Seujet 14, 1201 Genève</p>
                     <p className="text-white font-bold text-lg">+41 22 700 70 70</p>
                     <p className="text-gray-400">niyibizi@hin.ch</p>
                   </div>
                   
                   <div>
                       <h4 className="font-bold mb-4 text-gray-200">Valeurs</h4>
                       <span className="inline-block bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 border border-gray-700 mb-4">
                         Communautés sous-représentées bienvenues
                       </span>
                       <p className="text-gray-500 text-sm mt-8">© 2025 Cabinet du Seujet.</p>
                   </div>

                   <div className="h-48 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                       <iframe 
                         src={clinicData?.mapEmbedUrl} 
                         width="100%" 
                         height="100%" 
                         style={{border:0}} 
                         allowFullScreen="" 
                         loading="lazy"
                         className="opacity-80 hover:opacity-100 transition"
                       ></iframe>
                   </div>
                </div>
              </div>
           </footer>
        </div>
      )}
    </div>
  );
};

export default App;