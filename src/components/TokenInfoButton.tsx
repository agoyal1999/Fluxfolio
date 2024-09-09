"use client";
import React from "react";

interface TokenInfoButton {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const TokenInfoButton: React.FC<TokenInfoButton> = ({
  onClick,
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 border border-transparent rounded-lg py-2 px-4 shadow-md transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default TokenInfoButton;
