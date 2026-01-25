import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../../config/firebase';

const ProfileEditor = ({ user, userData, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.displayName || "",
    phone: userData?.phone || "",
    birthDate: userData?.birthDate ? new Date(userData.birthDate.seconds * 1000).toISOString().split('T')[0] : "",
    gender: userData?.gender || "",
    address: userData?.address || "",
    emergencyContact: userData?.emergencyContact || ""
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid), {
        ...formData,
        email: user.email,
        updatedAt: serverTimestamp(),
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null 
      }, { merge: true });

      if (formData.name !== user.displayName) {
        await updateProfile(user, { displayName: formData.name });
      }
      onClose();
    } catch (error) {
      alert("Erreur: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date de Naissance</label>
          <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Genre</label>
          <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900">
            <option value="">Sélectionner</option>
            <option value="Femme">Femme</option>
            <option value="Homme">Homme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse</label>
          <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact d'Urgence</label>
          <input type="text" placeholder="Nom et Téléphone" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className="w-full p-2 border rounded bg-white text-gray-900" />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-[#008080] text-white rounded font-bold hover:bg-[#006666]">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditor;