import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#800020] flex items-center justify-center z-[100] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-3xl font-serif font-bold tracking-wide">CABINET DU SEUJET</h1>
        <p className="text-gray-200 mt-2 font-light">Chargement de votre espace santé...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;