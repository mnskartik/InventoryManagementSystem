import React from "react";

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-[400px] max-w-full">
        {children}
      </div>
    </div>
  );
};
