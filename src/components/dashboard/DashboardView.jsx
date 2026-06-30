import React from 'react';
import { User, Calendar, LogOut, Edit3, CheckCircle, Clock, FileText, Phone, MapPin, ExternalLink, Activity, FlaskConical, CreditCard, Accessibility } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TRANSLATIONS } from '../../data/constants';

const DashboardView = ({ user, userData, isDoctor, appointments, onClose, onEditProfile, onBookNew, onViewAppointment, lang }) => {
  
  const t = TRANSLATIONS[lang || 'fr'].dashboard;

  const handleLogout = () => {
    signOut(auth).then(onClose);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 lg:pt-12 pb-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800 leading-tight">{t.title}</h1>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-[#299E74] flex items-center gap-1 font-medium transition-colors shrink-0">
            &larr; {t.backHome}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* PERFIL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              
              {/* EXIBIÇÃO DA FOTO */}
              <div className="flex items-center gap-4 mb-4">
                {user?.photoURL || userData?.photoURL ? (
                  <img 
                    src={user.photoURL || userData.photoURL} 
                    alt="Profil" 
                    className="w-14 h-14 rounded-full object-cover shadow-md border border-gray-200 shrink-0" 
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#16679B] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                    <User size={28} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-800 truncate">{user.displayName || t.userDefault}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="mb-6 space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                 {userData?.phone && (
                   <div className="flex items-center gap-3">
                     <Phone size={18} className="text-[#16679B] shrink-0" /> 
                     <span className="font-medium text-gray-700">{userData.phone}</span>
                   </div>
                 )}
                 {userData?.address && (
                   <div className="flex items-start gap-3">
                     <MapPin size={18} className="text-[#16679B] shrink-0 mt-0.5" /> 
                     <span className="whitespace-pre-line leading-relaxed text-gray-700">
                       {userData.address}
                     </span>
                   </div>
                 )}
                 {!userData?.phone && !userData?.address && (
                   <div className="text-center py-2">
                     <span className="text-xs italic text-gray-400">{t.incompleteProfile}</span>
                   </div>
                 )}
              </div>
              
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-50 text-[#16679B] font-bold rounded-lg border border-gray-100 transition-colors">
                  <Calendar size={18} /> {t.historyBtn}
                </button>
                <button onClick={onEditProfile} className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#16679B] rounded-lg transition-colors">
                  <Edit3 size={18} /> {t.editProfileBtn}
                </button>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={18} /> {t.logoutBtn}
                  </button>
                </div>
              </nav>
            </div>

            {/* BOTÃO DE AGENDAMENTO (VERDE PARA CHAMADA À AÇÃO) */}
            <div className="bg-[#299E74] text-white p-6 rounded-2xl shadow-lg text-center">
              <h3 className="font-bold text-lg mb-4">{t.needApptTitle}</h3>
              <button 
                onClick={onBookNew} 
                className="w-full py-3 bg-white text-[#299E74] rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
              >
                {t.bookApptBtn}
              </button>
            </div>
          </div>

          {/* HISTÓRICO E INFORMAÇÕES */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col gap-8">
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#16679B] flex items-center gap-2">
                  <Calendar className="text-[#16679B]" /> {t.historyTitle}
                </h2>
              </div>

              {/* Seção 1: A Ponte Transparente para a OneDoc */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Gestion des Rendez-vous</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Pour des raisons de sécurité et de stricte confidentialité médicale, votre historique complet et la gestion de vos rendez-vous sont centralisés sur la plateforme sécurisée OneDoc.
                </p>
                <a 
                  href="https://www.onedoc.ch/fr/login" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#299E74] bg-[#299E74]/10 hover:bg-[#299E74]/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors w-fit"
                >
                  <ExternalLink size={16} />
                  Consulter mon historique sur OneDoc
                </a>
              </div>

              <hr className="border-gray-100" />

              {/* Bloco de Informações Práticas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
                <h3 className="text-xl font-bold text-[#16679B] mb-6">
                  Informations Pratiques
                </h3>
                
                <ul className="space-y-6 text-sm text-gray-700 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="bg-[#16679B]/10 p-2 rounded-lg shrink-0">
                      <FlaskConical size={20} className="text-[#16679B]" />
                    </div>
                    <div className="mt-1">
                      <span className="font-bold text-gray-900">Laboratoires:</span> Viollier, Unilabs, Dianalabs, MGD
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="bg-[#16679B]/10 p-2 rounded-lg shrink-0">
                      <CreditCard size={20} className="text-[#16679B]" />
                    </div>
                    <span className="mt-1 leading-relaxed">
                      Paiement par carte ou directement auprès de l'assurance maladie.
                    </span>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="bg-[#16679B]/10 p-2 rounded-lg shrink-0">
                      <Accessibility size={20} className="text-[#16679B]" />
                    </div>
                    <span className="mt-1 leading-relaxed">
                      Accès PMR et transports publics à proximité (bus / tram).
                    </span>
                  </li>
                </ul>

                {/* Card de Acolhimento e Inclusão */}
                <div className="bg-[#fafafa] p-5 rounded-xl border border-gray-200 flex items-start gap-4 transition-colors hover:border-[#16679B]/30 hover:bg-[#F4F9F7]">
                  <span className="text-2xl leading-none shrink-0 mt-0.5 drop-shadow-sm">🏳️‍🌈</span>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Tous les patients sont les bienvenus pour parler de leur santé dans un environnement respectueux et déontologique, sans distinction de race, de genre, d'orientation religieuse ou sexuelle.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardView;