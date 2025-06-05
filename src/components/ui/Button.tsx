import React from "react";
import "./button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`custom-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
