import React from "react";
import "./Button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "edit" | "delete" | "login" | "logout" | "cart"; // ✅ thêm login, logout, cart variant
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  size = "md",
  variant = "default",
  ...props
}) => {
  return (
    <button
      className={`custom-button ${variant} ${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button