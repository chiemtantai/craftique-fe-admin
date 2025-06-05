import React from "react";
import "./button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg"; // ✅ thêm size
  variant?: "default" | "outline"; // ✅ thêm variant
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  size = "md",        // ✅ default size
  variant = "default", // ✅ default variant
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
