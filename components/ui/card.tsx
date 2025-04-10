import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded-xl shadow">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}