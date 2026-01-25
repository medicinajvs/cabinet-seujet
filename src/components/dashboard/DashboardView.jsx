import React, { useState } from 'react';
import { ChevronLeft, AlertTriangle, Stethoscope, Clock, User, Phone, Calendar, Edit3, File, LogOut, FileText, Video, MapPin, Info, Shield } from 'lucide-react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { getStatusLabel } from '../../utils/helpers';
import { DEFAULT_CLINIC_INFO } from '../../data/constants';

const DashboardView = ({ user, userData, isDoctor, appointments, onClose, onEditProfile, onBookNew, onViewAppointment }) => {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'clinic'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'scheduled' | 'completed'

  const now = new Date();
  const nextAppt = appointments.find(a => 
    (a.status === 'confirmed' || a.status === 'scheduled') && new Date(a.date + 'T' + a.time) > now
  );

  // Lógica de filtro simples
  const filteredAppointments = appointments.filter(appt => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'scheduled') return appt.status === 'confirmed' || appt.status === 'scheduled';
    return appt.status === filterStatus;
  });

  return (
    <div className="min-h-screen pt-6 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-serif text-gray-800">
              {isDoctor ? "Espace Médecin" : "Mon Espace Santé"}
            </h2>
            {isDoctor && <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">Mode Professionnel</span>}
          </div>
          <button onClick={onClose} className="text-[#008080] hover:underline flex items-center gap-1">
            <ChevronLeft size={16} /> Retour à l'accueil
          </button>
        </div>

        {/* Email Warning */}
        {user && !user.emailVerified && !user.isAnonymous && (
           <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm flex items-start gap-3">
             <AlertTriangle className="text-yellow-600 shrink-0" />
             <div>
               <h4 className="font-bold text-yellow-800">Vérifiez votre email</h4>
               <p className="text-sm text-yellow-700">Votre adresse email n'a pas encore été vérifiée. Certaines actions sont bloquées.</p>
               <button onClick={async () => { await sendEmailVerification(user); alert("Email renvoyé !"); }} className="text-sm underline mt-1 text-yellow-800 font-bold">Renvoyer l'email</button>
             </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDoctor ? 'bg-purple-100 text-purple-600' : 'bg-[#008080]/10 text-[#008080]'}`}>
                  {isDoctor ? <Stethoscope size={24} /> : <User size={24} />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-800 truncate">{user?.displayName || "Utilisateur"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              {!isDoctor && userData && (
                <div className="text-sm text-gray-600 mb-4 pt-4 border-t border-gray-100 space-y-1">
                  {userData.phone && <p className="flex items-center gap-2"><Phone size={12} /> {userData.phone}</p>}
                </div>
              )}

              <div className="space-y-2">
                <button onClick={() => setActiveTab('appointments')} className={`w-full py-2 text-left text-sm px-2 rounded flex items-center gap-2 transition ${activeTab === 'appointments' ? 'bg-gray-100 font-bold text-[#008080]' : 'text-gray-600 hover:bg-gray-50'}`}>
                   <Calendar size={14} /> Mes Rendez-vous
                </button>
                <button onClick={() => setActiveTab('clinic')} className={`w-full py-2 text-left text-sm px-2 rounded flex items-center gap-2 transition ${activeTab === 'clinic' ? 'bg-gray-100 font-bold text-[#008080]' : 'text-gray-600 hover:bg-gray-50'}`}>
                   <Info size={14} /> Infos Clinique
                </button>
                <button onClick={onEditProfile} className="w-full py-2 text-left text-sm text-gray-600 hover:bg-gray-50 px-2 rounded flex items-center gap-2 transition">
                   <Edit3 size={14} /> Modifier mon profil
                </button>
                <button onClick={() => signOut(auth).then(onClose)} className="w-full py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-sm font-bold flex items-center justify-center gap-2 transition mt-4">
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>
            
            {!isDoctor && (
              <div className="bg-[#008080] text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold mb-2">Besoin d'un rendez-vous ?</h3>
                <button onClick={onBookNew} className="w-full bg-white text-[#008080] py-2 rounded-lg font-bold hover:bg-gray-100 transition">
                  Prendre Rendez-vous
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            
            {/* TAB: Appointments */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`p-6 border-b border-gray-100 flex justify-between items-center ${isDoctor ? 'bg-purple-50' : ''}`}>
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    {isDoctor ? <FileText className="text-purple-600" size={20} /> : <Calendar className="text-[#008080]" size={20} />}
                    {isDoctor ? "Agenda des Consultations" : "Historique des Rendez-vous"}
                  </h3>
                  
                  {/* Filtros simples */}
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => setFilterStatus('all')} className={`px-3 py-1 rounded-full ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Tous</button>
                    <button onClick={() => setFilterStatus('scheduled')} className={`px-3 py-1 rounded-full ${filterStatus === 'scheduled' ? 'bg-[#008080] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>À venir</button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 relative">
                  {filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Aucun rendez-vous trouvé.</p>
                    </div>
                  ) : (
                    filteredAppointments.map(appt => {
                      const statusInfo = getStatusLabel(appt.status);
                      return (
                        <div 
                          key={appt.id} 
                          onClick={() => onViewAppointment(appt)}
                          className="p-6 hover:bg-gray-50 transition cursor-pointer flex items-start gap-4 group relative z-10"
                        >
                          <div className="flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 min-w-[60px] text-center hidden sm:flex shadow-sm z-10">
                            <span className="text-xs font-bold text-gray-500 uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl font-bold text-gray-800">{new Date(appt.date).getDate()}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800">
                                {isDoctor ? appt.userName : appt.doctorName}
                              </h4>
                              <span className={`px-2 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              {appt.type === 'video' ? <Video size={14} /> : <MapPin size={14} />}
                              {appt.type === 'video' ? 'Téléconsultation' : 'Au Cabinet'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                              <Clock size={14} className="inline" />
                              {new Date(appt.date).toLocaleDateString()} à {appt.time}
                            </p>
                          </div>
                          <ChevronLeft size={20} className="text-gray-300 transform rotate-180 group-hover:text-[#008080] transition self-center" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB: Clinic Info */}
            {activeTab === 'clinic' && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                  <h3 className="font-bold text-xl text-gray-800 border-b pb-4 mb-4">Informations du Cabinet</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold text-[#008080] mb-2 flex items-center gap-2"><Clock size={16}/> Horaires d'ouverture</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">{DEFAULT_CLINIC_INFO.openingHours}</p>
                     </div>
                     <div>
                        <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Urgences</h4>
                        <p className="text-gray-600 text-sm">{DEFAULT_CLINIC_INFO.emergencyInfo}</p>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                     <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Shield size={16}/> Politique d'annulation</h4>
                     <p className="text-gray-600 text-sm">{DEFAULT_CLINIC_INFO.policies}</p>
                  </div>

                  <div className="h-[300px] w-full bg-gray-200 rounded-xl overflow-hidden mt-6">
                     <iframe 
                       src={DEFAULT_CLINIC_INFO.mapEmbedUrl}
                       width="100%" 
                       height="100%" 
                       style={{border:0}} 
                       allowFullScreen="" 
                       loading="lazy"
                     ></iframe>
                  </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;