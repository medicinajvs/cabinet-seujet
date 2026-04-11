import React, { useState } from 'react';
import { User, Phone, MapPin, Save, Calendar } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { CLOUDFLARE_API_URL } from '../../data/constants';

const ProfileEditor = ({ user, userData, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user.displayName || userData?.displayName || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    birthDate: userData?.birthDate || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Atualiza o Nome no Firebase Auth
      if (user.displayName !== formData.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      // 2. Envia os dados extras para o Cloudflare Worker
      const response = await fetch(`${CLOUDFLARE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, ...formData })
      });
      
      if (!response.ok) throw new Error("Erreur de connexion API");

      alert("Profil mis à jour !");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar perfil no Cloudflare:", error);
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 p-2">
      <p className="text-sm text-gray-500 mb-4">Vos informations sont privées.</p>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" name="displayName" value={formData.displayName} onChange={handleChange}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]" required 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+41 79 000 00 00"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Adresse</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" name="address" value={formData.address} onChange={handleChange}
            placeholder="Ville, Rue..."
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]" 
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-lg text-gray-600 hover:bg-gray-50">Annuler</button>
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#800020] text-white rounded-lg font-bold hover:bg-[#600015] flex justify-center gap-2 transition">
          {loading ? "..." : <><Save size={18}/> Enregistrer</>}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditor;