import React from "react";
import { cn } from "../../lib/utils";

export const Button = ({ children, variant = "default", className, ...props }) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
