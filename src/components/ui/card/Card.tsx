import React from "react";
import "./card.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card ${className}`.trim()}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card-header ${className}`.trim()}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => {
  return <h3 className={`card-title ${className}`.trim()}>{children}</h3>;
};

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card-content ${className}`.trim()}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card-footer ${className}`.trim()}>{children}</div>;
};
