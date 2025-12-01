import React from 'react';

export function Card({ children, className, ...props }) {
  return <div className={`rounded-lg border bg-white text-black shadow-sm ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={`p-4 border-t ${className}`}>{children}</div>;
}