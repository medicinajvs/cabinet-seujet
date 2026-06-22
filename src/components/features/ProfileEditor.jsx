import React, { useState, useRef } from 'react';
import { User, Phone, MapPin, Save, Upload, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { CLOUDFLARE_API_URL } from '../../data/constants';

// Adicionamos a prop showToast aqui no topo!
const ProfileEditor = ({ user, userData, onClose, onUpdate, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    displayName: user.displayName || userData?.displayName || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    birthDate: userData?.birthDate || '', 
    photoURL: user.photoURL || userData?.photoURL || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // 1. Pega o token seguro do Firebase
      const token = await user.getIdToken(); 

      const response = await fetch(`${CLOUDFLARE_API_URL}/upload-avatar?userId=${user.uid}`, {
        method: 'POST',
        body: file,
        headers: { 
          'Content-Type': file.type,
          // 2. Envia o token como credencial
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) throw new Error("Erro ao carregar a imagem");
      
      const data = await response.json();
      
      await updateProfile(user, { photoURL: data.photoURL });
      setFormData(prev => ({ ...prev, photoURL: data.photoURL }));
      
    } catch (error) {
      console.error(error);
      // Substituído o alert() pelo showToast elegante
      showToast("Falha ao carregar a imagem. Tente novamente.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
  
    e.preventDefault();
    setLoading(true);
    try {

      const token = await user.getIdToken(); // Pega o token
      
      // ... (atualiza o displayName se mudou)

      const response = await fetch(`${CLOUDFLARE_API_URL}/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o token
        },
        body: JSON.stringify({ uid: user.uid, ...formData })
      });

      if (user.displayName !== formData.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      if (!response.ok) throw new Error("Erreur de connexion API");

      if (onUpdate) onUpdate(formData);
      
      // Notificação elegante de Sucesso e fechamento do modal!
      showToast("Profil mis à jour !", "success");
      onClose();
    } catch (error) {
      // Notificação elegante de Erro!
      showToast("Erreur: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 p-2">
      <p className="text-sm text-gray-500 mb-4">Vos informations sont privées.</p>

      <div className="flex flex-col items-center mb-6">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.photoURL ? (
            <img 
              src={formData.photoURL} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:border-[#2B7A5F] transition" 
            />
          ) : (
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-[#2B7A5F] transition">
              <User size={36} className="text-gray-400 group-hover:text-[#2B7A5F]" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
            {uploadingImage ? (
              <Loader2 className="animate-spin text-white" size={24} />
            ) : (
              <Upload className="text-white" size={24} />
            )}
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />
        <p className="text-xs text-gray-500 mt-3 font-medium">Cliquez pour modifier la photo</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" name="displayName" value={formData.displayName} onChange={handleChange}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#2B7A5F] focus:ring-1 focus:ring-[#2B7A5F]" required 
          />
        </div>
      </div>

      {/* CAMPO DE TELEFONE GLOBAL */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+41 79 000 00 00"
            // Nova Regra: Permite +, números, espaços e parênteses de qualquer país (7 a 20 caracteres)
            pattern="^\+?[0-9\s\-\(\)]{7,20}$"
            title="Entrez un numéro valide avec code pays (ex: +41...)"
            maxLength="20"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#2B7A5F] focus:ring-1 focus:ring-[#2B7A5F]" 
          />
        </div>
      </div>

      {/* CAMPO DE ENDEREÇO GLOBAL (Padrão UPU) */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between items-end">
          <span>Adresse Complète</span>
          <span className="text-[10px] text-gray-400 font-normal">Format international (UPU)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <textarea 
            name="address" value={formData.address} onChange={handleChange}
            placeholder="Rue et Numéro&#10;NPA et Ville&#10;PAYS"
            rows="3"
            minLength="10"
            maxLength="150"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#2B7A5F] focus:ring-1 focus:ring-[#2B7A5F] resize-none leading-relaxed" 
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Ex: Musterweg 4, 3001 Bern, SWITZERLAND</p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">
          Annuler
        </button>
        <button type="submit" disabled={loading || uploadingImage} className="flex-1 py-3 bg-[#2B7A5F] text-white rounded-lg font-bold hover:bg-[#245F4B] flex justify-center items-center gap-2 transition disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ProfileEditor;