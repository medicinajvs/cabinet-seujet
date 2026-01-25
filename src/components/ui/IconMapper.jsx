import React from 'react';
import { Stethoscope, Activity, Syringe, Heart, Users, Shield } from 'lucide-react';

const IconMapper = ({ type, className }) => {
  switch (type) {
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Syringe': return <Syringe className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Shield': return <Shield className={className} />;
    default: return <Activity className={className} />;
  }
};

export default IconMapper;