import React from 'react';
import { User, Calendar, LogOut, Edit3, CheckCircle, Clock, FileText, Phone, MapPin, ExternalLink } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TRANSLATIONS } from '../../data/constants';

const DashboardView = ({ user, userData, isDoctor, appointments, onClose, onEditProfile, onBookNew, onViewAppointment, lang }) => {
  
  const t = TRANSLATIONS[lang || 'fr'].dashboard;

  const handleLogout = () => {
    signOut(auth).then(onClose);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800">{t.title}</h1>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-[#2B7A5F] flex items-center gap-1 font-medium">
            &larr; {t.backHome}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* PERFIL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              
              {/* EXIBIÇÃO DA FOTO AQUI */}
              <div className="flex items-center gap-4 mb-4">
                {user?.photoURL || userData?.photoURL ? (
                  <img 
                    src={user.photoURL || userData.photoURL} 
                    alt="Profil" 
                    className="w-14 h-14 rounded-full object-cover shadow-md border border-gray-200 shrink-0" 
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#2B7A5F] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
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
                     <Phone size={18} className="text-[#2B7A5F] shrink-0" /> 
                     <span className="font-medium text-gray-700">{userData.phone}</span>
                   </div>
                 )}
                 {userData?.address && (
                   <div className="flex items-start gap-3">
                     <MapPin size={18} className="text-[#2B7A5F] shrink-0 mt-0.5" /> 
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
                <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-50 text-[#2B7A5F] font-bold rounded-lg border border-gray-100">
                  <Calendar size={18} /> {t.historyBtn}
                </button>
                <button onClick={onEditProfile} className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2B7A5F] rounded-lg transition">
                  <Edit3 size={18} /> {t.editProfileBtn}
                </button>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <LogOut size={18} /> {t.logoutBtn}
                  </button>
                </div>
              </nav>
            </div>

            <div className="bg-[#2B7A5F] text-white p-6 rounded-2xl shadow-lg text-center">
              <h3 className="font-bold text-lg mb-4">{t.needApptTitle}</h3>
              <button 
                onClick={onBookNew} 
                className="w-full py-3 bg-white text-[#2B7A5F] rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
              >
                {t.bookApptBtn}
              </button>
            </div>
          </div>

          {/* HISTÓRICO */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-[#2B7A5F]" /> {t.historyTitle}
                </h2>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} className="opacity-30" />
                  </div>
                  <p>{t.noHistory}</p>
                  <p className="text-sm mt-2">{t.noHistorySub}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="border border-gray-100 p-5 rounded-xl hover:border-[#2B7A5F] transition bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-green-50 text-[#2B7A5F] rounded-full flex items-center justify-center shrink-0">
                           {appt.type === 'redirection_onedoc' ? <ExternalLink size={20}/> : <Phone size={20}/>}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{appt.doctorName}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(appt.date).toLocaleDateString()} à {appt.time}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block font-medium ${appt.type === 'redirection_onedoc' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                            {appt.type === 'redirection_onedoc' ? t.redirectOneDoc : t.phoneCall}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle size={16} /> {t.interestRecorded}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardView;