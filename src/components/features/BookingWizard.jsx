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

          {/* ---> INÍCIO DA SUBSTITUIÇÃO <--- */}
          <div className="flex flex-col items-center w-full mt-4 max-w-2xl mx-auto">
             
             {/* O iframe só aparece se a médica aceitar OneDoc */}
             {selectedDoc.bookingMethod === 'onedoc_or_phone' && (
               <div className="w-full rounded-xl border border-gray-200 overflow-hidden mb-6 bg-white shadow-sm">
                  <iframe 
                    className="od-widget" 
                    id="od-widget-5116f8a336222bcee069680dff50ad796defc8ad2046ca0fdfc519223d2185bd" 
                    src="https://www.onedoc.ch/fr/widget/5116f8a336222bcee069680dff50ad796defc8ad2046ca0fdfc519223d2185bd" 
                    frameBorder="0" 
                    style={{ width: '100%', height: '420px' }}
                  ></iframe>
               </div>
             )}

             {/* Bloco Elegante para o Telefone (Aparece para todos) */}
             <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl w-full border border-gray-100">
                 <span className="text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                   {t("Assistance téléphonique", "Phone Assistance")}
                 </span>
                 <div className="flex items-center gap-3 text-gray-800 font-bold text-2xl">
                    <Phone size={22} className="text-[#2B7A5F]" />
                    {/* Mantivemos o handleAction como botão para sua API registrar o contato no painel! */}
                    <button onClick={(e) => handleAction(e, 'phone', "tel:+41227007070")} className="hover:text-[#2B7A5F] transition-colors">
                      +41 22 700 70 70
                    </button>
                 </div>
             </div>
          </div>
          {/* ---> FIM DA SUBSTITUIÇÃO <--- */}
          {!preselectedDoctorId && (
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 underline text-sm">{t("Retour", "Back")}</button>
          )}
        </div>
      )}
    </div>
  );
};
export default BookingWizard;