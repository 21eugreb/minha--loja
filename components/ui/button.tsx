import React from "react";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="px-4 py-2 bg-[#ff7300] text-white rounded" {...props}>
      {children}
    </button>
  );
}