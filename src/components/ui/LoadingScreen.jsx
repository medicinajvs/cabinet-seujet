import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Passo 1: Inicia o desaparecimento (fade-out) após 2.2 segundos
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2200);

    // Passo 2: Remove o componente do código após o fade-out concluir
    const unmountTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000); // 2.2s de exibição + 0.8s de transição

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[800ms] ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes expandLine {
            0% { width: 0; opacity: 0; }
            100% { width: 6rem; opacity: 1; }
          }
          @keyframes slowFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          .animate-title { animation: slideUpFade 0.8s ease-out forwards; }
          .animate-subtitle { animation: slideUpFade 0.8s ease-out 0.15s forwards; opacity: 0; }
          .animate-line { animation: expandLine 0.8s ease-out 0.4s forwards; opacity: 0; }
          .animate-tagline { animation: slowFadeIn 1s ease-out 0.8s forwards; opacity: 0; }
        `}
      </style>

      <div className={`flex flex-col items-center text-center px-6 transition-transform duration-[800ms] ease-in-out ${isExiting ? 'scale-105' : 'scale-100'}`}>
        <h1 className="text-4xl md:text-5xl font-serif text-[#2B7A5F] font-bold tracking-wide animate-title">
          Cabinet Médical
        </h1>
        <p className="text-xs md:text-sm tracking-[0.3em] text-gray-500 mt-3 uppercase font-medium animate-subtitle">
          Dre. Eva Niyibizi
        </p>
        <div className="h-[1px] bg-gray-300 my-6 animate-line"></div>
        <p className="text-sm md:text-base font-serif italic text-gray-400 animate-tagline">
          Votre bien-être, notre mission.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;