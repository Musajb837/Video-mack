
import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl animate__animated animate__fadeInRight border ${
      type === 'success' 
        ? 'bg-dark-light border-green-500/30 text-green-400' 
        : 'bg-dark-light border-red-500/30 text-red-400'
    }`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};

export default Toast;
