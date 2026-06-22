import React, { useState } from 'react';
import { Phone, ExternalLink } from 'lucide-react';
import { CLOUDFLARE_API_URL } from '../../data/constants';

// Adicionamos a prop 'preselectedDoctorId'
const BookingWizard = ({ doctors, user, onClose, lang, preselectedDoctorId }) => {
  
  // Procuramos a médica pelo ID passado
  const initialDoctor = preselectedDoctorId 
    ? doctors.find(doc => doc.id === preselectedDoctorId) 
    : null;

  // Se já veio uma médica, o passo inicial é o 2. Senão, é o 1.
  const [step, setStep] = useState(initialDoctor ? 2 : 1);
  
  // Já iniciamos o estado com a médica encontrada
  const [selectedDoc, setSelectedDoc] = useState(initialDoctor);

  // ... mantenha o resto do seu código igual daqui para baixo

  const t = (fr, en) => (lang === 'fr' ? fr : en);
  const availableDoctors = doctors.filter(d => d.bookable);

  const handleAction = async (e, type, url) => {
    e.preventDefault();
    if (user && !user.isAnonymous) {
      try {
        const token = await user.getIdToken(); // Pega o token
        
        await fetch(`${CLOUDFLARE_API_URL}/appointments`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envia o token
          },
          body: JSON.stringify({
            userId: user.uid,
            userName: user.displayName || "Patient",
            doctorName: selectedDoc.name,
            doctorId: selectedDoc.id,
            type: type === 'onedoc' ? 'redirection_onedoc' : 'contact_tel',
            status: 'interested',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('fr-CH')
          })
        });
      } catch (err) { console.error("Erro API", err); }
    }
    if (type === 'onedoc') window.open(url, '_blank');
    else if (type === 'phone') window.location.href = url;
  };

  return (
    <div className="min-h-[400px]">
      {step === 1 && (
        <div className="space-y-6 text-center">
          <h4 className="text-xl font-bold text-gray-800">{t("Choisissez votre praticien", "Choose your practitioner")}</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {availableDoctors.map((doc) => (
              <div 
                key={doc.id} onClick={() => { setSelectedDoc(doc); setStep(2); }} 
                className="cursor-pointer bg-white p-6 rounded-xl shadow-md border-2 border-transparent hover:border-[#2B7A5F] transition w-full sm:w-64 flex flex-col items-center"
              >
                <img src={doc.image} className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" alt={doc.name} />
                {/* O NOME JÁ CONTÉM DRE. NAS CONSTANTES */}
                <h5 className="font-bold text-gray-800 text-lg">{doc.name}</h5>
                {/* O PAPEL "MÉDECIN" FOI REMOVIDO DAQUI */}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedDoc && (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center">
             <img src={selectedDoc.image} className="w-20 h-20 rounded-full mb-3 shadow" />
             <h4 className="text-xl font-bold text-gray-800">{t("Prendre rendez-vous avec", "Book with")} {selectedDoc.name}</h4>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl max-w-md mx-auto space-y-6 border border-gray-100">
             {selectedDoc.bookingMethod === 'onedoc_or_phone' && (
                 <button onClick={(e) => handleAction(e, 'onedoc', selectedDoc.oneDocLink)} className="flex items-center justify-center gap-3 w-full bg-[#2B7A5F] text-white py-4 rounded-xl font-bold hover:bg-[#245F4B] transition shadow-lg">
                    <ExternalLink size={20} /> {t("Réserver sur OneDoc", "Book on OneDoc")}
                 </button>
             )}
             {selectedDoc.bookingMethod === 'onedoc_or_phone' && <div className="text-gray-400 text-sm font-medium">{t("OU", "OR")}</div>}

             <div className="text-gray-800">
                 <p className="mb-2 text-sm text-gray-500">{t("Par téléphone au cabinet :", "Call the practice :")}</p>
                 <button onClick={(e) => handleAction(e, 'phone', "tel:+41227007070")} className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 hover:text-[#2B7A5F] transition w-full">
                    <Phone size={24} className="text-[#2B7A5F]" /> +41 22 700 70 70
                 </button>
             </div>
          </div>
          {!preselectedDoctorId && (
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 underline text-sm">{t("Retour", "Back")}</button>
          )}
        </div>
      )}
    </div>
  );
};
export default BookingWizard;