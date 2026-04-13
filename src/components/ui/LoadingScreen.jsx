import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#A8E6CF] z-50">
       <Loader2 className="w-12 h-12 text-[#2B7A5F] animate-spin mb-4" />
       <p className="text-[#2B7A5F] font-bold text-lg animate-pulse">Chargement...</p>
    </div>
  );
};

export default LoadingScreen;