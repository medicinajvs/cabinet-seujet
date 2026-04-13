import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, Phone, Mail, MapPin, 
  User, ExternalLink, ChevronUp, ChevronDown, MessageCircle, FileText, Lock, Save, Edit3, Globe, Heart, CheckCircle, ArrowRight, ArrowLeft, BookOpen, Star, Activity, Monitor, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, setPersistence, browserLocalPersistence
} from 'firebase/auth';

import { auth, googleProvider } from './config/firebase';
import { 
  DEFAULT_SERVICES, DEFAULT_DOCTORS, DEFAULT_CLINIC_INFO, TRANSLATIONS, IMAGES, 
  TESTIMONIALS, TEACHING_INFO, TECHNICAL_PLATFORM, COMMUNITY_ENGAGEMENTS, CLOUDFLARE_API_URL 
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
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [clinicData, setClinicData] = useState(DEFAULT_CLINIC_INFO);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS);
  
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  
  const [openBios, setOpenBios] = useState({}); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const isDoctor = !!(user && doctors.some(d => d.email === user.email && d.role === "Ancienne Cheffe de Clinique aux HUG"));
  const readyToFetch = authInitialized && profileLoaded;
  const { appointments } = useAppointments(user, isDoctor, readyToFetch);

  const heroSlides = [
    { type: 'rubric' }, 
    { type: 'clinic', image: IMAGES.clinic1, title: t.carousel.clinicSlide1Title, subtitle: t.carousel.clinicSlide1Subtitle },
    { type: 'clinic', image: IMAGES.clinic2, title: t.carousel.clinicSlide2Title, subtitle: t.carousel.clinicSlide2Subtitle },
    { type: 'clinic', image: IMAGES.clinic3, title: t.carousel.clinicSlide3Title, subtitle: t.carousel.clinicSlide3Subtitle },
  ];
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextHeroSlide = () => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  const prevHeroSlide = () => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['fr'] || "";
  };

  const toggleBio = (id) => setOpenBios(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const handleScrollColor = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScrollColor);
    return () => window.removeEventListener('scroll', handleScrollColor);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser && !currentUser.isAnonymous) {
            fetch(`${CLOUDFLARE_API_URL}/users/${currentUser.uid}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data) setUserData(data);
                else setUserData(null);
              })
              .catch(err => {
                console.error("Erro Cloudflare API:", err);
                setUserData(null);
              })
              .finally(() => setProfileLoaded(true));
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
        
        fetch(`${CLOUDFLARE_API_URL}/users`, {
           method: 'POST',
           body: JSON.stringify({ uid: cred.user.uid, email: email })
        });
        
        setAuthSuccess("Vérifiez votre email!"); setTimeout(onLoginSuccess, 1500);
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setAuthSuccess("Email envoyé."); setTimeout(() => setAuthMode('login'), 3000);
      }
    } catch (err) { setAuthError(err.message.replace("Firebase: ", "")); }
  };

  if (!authInitialized) return <LoadingScreen className="bg-[#A8E6CF]" />;

  const DoctorCard = ({ doc }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col hover:border-[#A8E6CF]">
      <div className="h-64 overflow-hidden relative group">
          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#2B7A5F]">{doc.name}</h3>
        
        {doc.role && <p className="text-[#2B7A5F] font-medium text-[11px] uppercase tracking-wide mb-1 leading-tight">{doc.role}</p>}
        {getText(doc.specialty) && <p className="text-gray-500 font-bold text-sm mb-2">{getText(doc.specialty)}</p>}
        {getText(doc.description) && <p className="text-gray-500 text-xs mb-4 line-clamp-4 leading-relaxed">{getText(doc.description)}</p>}
        
        {doc.languages && doc.languages.length > 0 && (
          <div className="flex gap-1 mb-4 flex-wrap mt-2">
             {doc.languages.map(l => (
               <span key={l} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">{l}</span>
             ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100">
            <button onClick={() => toggleBio(doc.id)} className="flex items-center justify-between w-full text-sm font-bold text-gray-700 hover:text-[#2B7A5F] mb-3">
               {t.doctors.bio}
               {openBios[doc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openBios[doc.id] && (
               <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded mb-3 text-left animate-in fade-in leading-relaxed border border-gray-100">
                 {getText(doc.biography)}
               </div>
            )}
            
            {doc.bookable && (
                <button onClick={() => setShowBookingModal(true)} className="w-full bg-[#A8E6CF] text-gray-900 py-2.5 rounded-lg text-sm font-bold hover:bg-[#88D4B4] transition shadow-sm">
                    {t.doctors.book}
                </button>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`font-sans text-gray-700 relative h-full transition-colors duration-1000 ease-in-out bg-white`}>
      
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
             <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#A8E6CF] focus:ring-1 focus:ring-[#A8E6CF]"/>
             <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#A8E6CF] focus:ring-1 focus:ring-[#A8E6CF]"/>
             <button type="submit" className="w-full bg-[#A8E6CF] text-gray-900 py-3 rounded font-bold hover:bg-[#88D4B4] transition shadow">Entrer</button>
             
             <button type="button" onClick={() => signInWithPopup(auth, googleProvider).then(onLoginSuccess)} className="w-full border p-3 rounded flex justify-center items-center gap-3 hover:bg-gray-50 bg-white transition shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="font-bold text-gray-600">Google</span>
            </button>

             <div className="text-center text-sm space-y-2 mt-4">
              {authMode === 'login' && <button type="button" onClick={() => setAuthMode('signup')} className="text-[#2B7A5F] font-bold hover:underline">S'inscrire</button>}
              {authMode === 'signup' && <button type="button" onClick={() => setAuthMode('login')} className="text-[#2B7A5F] font-bold hover:underline">Se connecter</button>}
            </div>
          </form>
      </Modal>

      {showDashboard && user ? (
        <DashboardView 
          user={user} userData={userData} isDoctor={isDoctor} appointments={appointments} 
          onClose={() => setShowDashboard(false)} onEditProfile={() => setShowProfileEdit(true)} 
          onBookNew={() => setShowBookingModal(true)} lang={lang}
        />
      ) : (
        <div className="scroll-container" onScroll={(e) => setScrolled(e.target.scrollTop > 50)}>
           
           <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
              {!scrolled && <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent -z-10 pointer-events-none"></div>}

              <div className="container mx-auto px-6 flex justify-between items-center relative z-10">
                <div className="hidden md:flex items-center gap-8">
                    {['home', 'mission', 'team', 'clinic'].map(item => (
                        <a key={item} href={`#${item}`} 
                           className={`font-semibold text-sm uppercase tracking-wider transition-colors 
                           ${scrolled ? 'text-gray-800 hover:text-[#2B7A5F]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>
                           {t.nav[item]}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4 md:gap-6 ml-auto">
                    <div className={`hidden md:flex items-center gap-2 font-medium text-sm ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                        <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded transition ${lang === 'fr' ? (scrolled ? 'text-gray-900 font-bold bg-gray-100' : 'font-bold bg-white/20') : 'hover:bg-white/10'}`}>FR</button>
                        <span>|</span>
                        <button onClick={() => setLang('en')} className={`px-2 py-1 rounded transition ${lang === 'en' ? (scrolled ? 'text-gray-900 font-bold bg-gray-100' : 'font-bold bg-white/20') : 'hover:bg-white/10'}`}>EN</button>
                    </div>

                    {user ? (
                        <button onClick={() => setShowDashboard(true)} className="flex items-center gap-2 font-bold text-gray-900 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition border border-gray-100"><User size={18} /> <span className="hidden sm:inline">{t.nav.mySpace}</span></button>
                    ) : (
                        <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className={`font-bold text-sm transition ${scrolled ? 'text-gray-800 hover:text-[#2B7A5F]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>{t.nav.login}</button>
                    )}
                </div>
                
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden ${scrolled ? 'text-gray-800' : 'text-white'}`}><Menu /></button>
              </div>
              
              {isMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl py-4 px-6 flex flex-col space-y-4 border-t border-gray-100 text-gray-800">
                  <a href="#home" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
                  <a href="#mission" onClick={() => setIsMenuOpen(false)}>{t.nav.mission}</a>
                  <a href="#team" onClick={() => setIsMenuOpen(false)}>{t.nav.team}</a>
                  <button onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }} className="text-left font-bold text-[#2B7A5F]">{t.nav.login}</button>
                </div>
              )}
           </nav>

           <section id="home" className="relative h-screen overflow-hidden bg-gray-900 pt-20">
             {heroSlides.map((slide, index) => (
               <div key={index} className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${currentHeroSlide === index ? 'opacity-100' : 'opacity-0'}`}>
                 {slide.type === 'rubric' ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#A8E6CF] p-6 pt-20">
                     <div className="text-center w-full max-w-2xl mt-12 md:mt-0">
                       <div className="relative flex justify-center mb-8 group cursor-default">
                          <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto group-hover:scale-105 transition duration-700">
                            <path d="M 50 100 L 150 100 L 165 60 L 195 150 L 215 80 L 230 100 L 350 100" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                            <text x="175" y="115" textAnchor="end" fontSize="90" fontWeight="300" fontFamily="Georgia, serif" fill="#1F2937" letterSpacing="-4">E</text>
                            <text x="205" y="115" textAnchor="start" fontSize="90" fontWeight="300" fontFamily="Georgia, serif" fill="#1F2937" letterSpacing="-4">N</text>
                            <text x="200" y="165" textAnchor="middle" fontSize="18" fontWeight="600" fontFamily="Arial, sans-serif" fill="#1F2937" letterSpacing="6">EVA NIYIBIZI</text>
                            <text x="200" y="185" textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif" fill="#1F2937" letterSpacing="3">INTERNISTE & URGENTISTE</text>
                          </svg>
                       </div>
                       <p className="text-xl md:text-2xl font-serif max-w-lg mx-auto leading-relaxed mt-4 text-gray-800 font-medium">{t.carousel.rubricSubtitle}</p>
                       <button onClick={() => setShowBookingModal(true)} className="mt-8 bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition shadow-xl">{t.hero.cta}</button>
                     </div>
                   </div>
                 ) : (
                   <div className="absolute inset-0 z-0 bg-cover bg-center" style={{backgroundImage: `url("${slide.image}")`}}>
                     <div className="absolute inset-0 bg-black/40"></div> 
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                        <div className="max-w-3xl mt-12 md:mt-0 pt-16">
                           {slide.title && <h2 className="text-4xl md:text-6xl font-bold mb-4 font-serif drop-shadow-lg">{slide.title}</h2>}
                           {slide.subtitle && <p className="text-xl md:text-3xl mx-auto font-medium leading-relaxed drop-shadow-md mb-8">{slide.subtitle}</p>}
                           <button onClick={() => setShowBookingModal(true)} className="bg-[#A8E6CF] text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-[#88D4B4] transition shadow-xl">{t.hero.cta}</button>
                        </div>
                     </div>
                   </div>
                 )}
               </div>
             ))}

             <button onClick={prevHeroSlide} className="absolute left-6 top-1/2 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition"><ChevronLeft size={32} /></button>
             <button onClick={nextHeroSlide} className="absolute right-6 top-1/2 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition"><ChevronRight size={32} /></button>
             <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex gap-3">
               {heroSlides.map((_, index) => (
                 <button key={index} onClick={() => setCurrentHeroSlide(index)} className={`w-3 h-3 rounded-full border-2 border-white/80 transition duration-300 ${currentHeroSlide === index ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'}`}></button>
               ))}
             </div>
           </section>

           <section id="mission" className="py-20 bg-white">
               <div className="container mx-auto px-6">
                   <div className="text-center mb-16">
                       <div className="max-w-2xl mx-auto text-gray-700 text-lg font-medium bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                          {getText(DEFAULT_CLINIC_INFO.features[0])}
                       </div>
                   </div>
                   
                   <div className="grid md:grid-cols-3 gap-8 items-stretch">
                       
                       <div className="md:col-span-2 bg-gray-50 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col h-full">
                           <h3 className="text-xl font-bold text-[#2B7A5F] mb-4 flex items-center gap-2"><BookOpen/> {t.sections.teaching}</h3>
                           
                           <p className="text-gray-700 leading-relaxed text-lg mb-8 max-w-xl">
                               {getText(TEACHING_INFO.description)}
                           </p>
                           
                           <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                               <div className="bg-[#2B7A5F] text-white px-6 py-5 rounded-xl shadow font-bold text-center flex-1 flex flex-col justify-center items-center border border-[#A8E6CF]">
                                   <span className="block text-base">Médecin en formation</span>
                                   <span className="block text-lg text-[#A8E6CF] mt-1">postgraduée</span>
                               </div>
                               <div className="flex flex-col gap-4 flex-1">
                                   <div className="bg-[#2B7A5F] text-white px-4 py-3 rounded-xl shadow font-bold text-center border border-[#A8E6CF] text-sm flex-1 flex items-center justify-center">
                                       étudiant 3ème année Master
                                   </div>
                                   <div className="bg-[#2B7A5F] text-white px-4 py-3 rounded-xl shadow font-bold text-center border border-[#A8E6CF] text-sm flex-1 flex items-center justify-center">
                                       étudiant 2ème année Bachelor
                                   </div>
                               </div>
                           </div>
                       </div>
                       
                       <div className="md:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center h-full">
                           <h3 className="text-xl font-bold text-[#2B7A5F] mb-6 flex items-center justify-center gap-2"><Heart/> {t.sections.community}</h3>
                           <span className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md border border-gray-700 w-full hover:bg-gray-700 transition">Réseau MEDIX</span>
                       </div>
                       
                   </div>
               </div>
           </section>

           <section id="team" className="py-20 bg-gray-50">
             <div className="container mx-auto px-6">
               <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-[#2B7A5F] mb-2">{t.doctors.title}</h2>
                  <div className="w-20 h-1 bg-gray-300 mx-auto"></div>
               </div>
               
               <div className="max-w-3xl mx-auto mb-12 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center gap-3 text-gray-700 font-medium">
                  <Globe className="text-[#2B7A5F]" size={20} />
                  <span>{t.sections.multilingual}: Français, English, Português, Hebrew, Română, Kinyarwanda</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
               </div>
             </div>
           </section>

           <section id="clinic" className="py-20 bg-white">
               <div className="container mx-auto px-6">
                   <h2 className="text-3xl font-bold text-center text-[#2B7A5F] mb-16">{t.sections.services}</h2>
                   <div className="grid md:grid-cols-3 gap-8 mb-20">
                       {DEFAULT_SERVICES.map((s, i) => (
                           <div key={i} className="p-6 border border-gray-100 rounded-xl hover:border-[#A8E6CF] transition group bg-white shadow-sm">
                               <div className="w-12 h-12 bg-[#A8E6CF]/20 rounded-full flex items-center justify-center text-[#2B7A5F] mb-4 group-hover:bg-[#A8E6CF] group-hover:text-gray-900 transition">
                                   <IconMapper type={s.iconType} />
                               </div>
                               <h4 className="font-bold text-lg mb-2 text-gray-800">{getText(s.title)}</h4>
                               <p className="text-sm text-gray-600 leading-relaxed">{getText(s.description)}</p>
                           </div>
                       ))}
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                       <div className="space-y-8">
                           <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                               <h3 className="font-bold text-xl text-[#2B7A5F] border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                                 <Monitor size={24}/> {t.sections.equipment}
                               </h3>
                               <ul className="space-y-4">
                                   {TECHNICAL_PLATFORM.equipment.map((eq, i) => (
                                       <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm">
                                         <Activity size={20} className="text-[#2B7A5F] flex-shrink-0"/> {getText(eq)}
                                       </li>
                                   ))}
                               </ul>
                           </div>
                           <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                               <h3 className="font-bold text-xl text-[#2B7A5F] border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                                 <CheckCircle size={24}/> {t.sections.care}
                               </h3>
                               <ul className="grid grid-cols-2 gap-3">
                                   {TECHNICAL_PLATFORM.careRoom.map((cr, i) => (
                                       <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                         <div className="w-1.5 h-1.5 rounded-full bg-[#A8E6CF]"></div> {getText(cr)}
                                       </li>
                                   ))}
                               </ul>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <img src={IMAGES.clinic1} onClick={() => setSelectedImage(IMAGES.clinic1)} className="rounded-xl shadow-md cursor-pointer hover:opacity-90 transition h-40 w-full object-cover border border-gray-100" />
                           <img src={IMAGES.clinic2} onClick={() => setSelectedImage(IMAGES.clinic2)} className="rounded-xl shadow-md cursor-pointer hover:opacity-90 transition h-40 w-full object-cover border border-gray-100" />
                           <img src={IMAGES.clinic3} onClick={() => setSelectedImage(IMAGES.clinic3)} className="col-span-2 rounded-xl shadow-md cursor-pointer hover:opacity-90 transition h-56 w-full object-cover border border-gray-100" />
                       </div>
                   </div>
               </div>
           </section>

           <section className="py-16 bg-[#A8E6CF] text-gray-900 mt-12">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'un rendez-vous ?</h2>
                <button 
                  onClick={() => setShowBookingModal(true)} 
                  className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-50 transition shadow-lg transform hover:scale-105"
                >
                  Prendre Rendez-vous
                </button>
              </div>
           </section>

           <footer className="bg-white text-gray-800 pt-16 pb-8 w-full max-w-full overflow-hidden border-t border-gray-100">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div>
                     <h3 className="text-2xl font-serif font-bold mb-4 text-[#2B7A5F]">Adresse du cabinet</h3>
                     <p className="text-gray-600 mb-4">Quai du Seujet 14, 1201 Genève</p>
                     
                     {/* NÚMERO DE TELEFONE AGORA É UM LINK CLICÁVEL (tel:) */}
                     <a href="tel:+41227007070" className="block text-gray-900 font-bold text-lg hover:text-[#2B7A5F] transition-colors w-fit">
                        +41 22 700 70 70
                     </a>
                     
                     {/* E-MAIL AGORA É UM LINK CLICÁVEL (mailto:) */}
                     <a href="mailto:niyibizi@hin.ch" className="inline-block text-gray-900 bg-[#A8E6CF] px-3 py-1 rounded text-sm font-bold mt-2 hover:bg-[#88D4B4] transition-colors w-fit">
                        niyibizi@hin.ch
                     </a>
                     
                   </div>
                   
                   <div>
                       <h4 className="font-bold mb-4 text-[#2B7A5F]">{t.footer.engagementsTitle}</h4>
                       <p className="text-gray-600 text-sm leading-relaxed pr-6">
                         {t.footer.missionText}
                       </p>
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