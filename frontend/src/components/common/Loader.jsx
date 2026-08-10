import React from "react";

export default function Loader() {
  return (
    // 'flex-grow' jisse ye container full screen width aur available height le le
    <div className="flex-grow flex items-center justify-center min-h-[50vh]">
      <div className="relative flex justify-center items-center">
        {/* Outer pulsing ring */}
        <div className="absolute animate-ping w-12 h-12 rounded-full border-4 border-green-500 opacity-20"></div>
        {/* Inner spinning ring */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
      </div>
    </div>
  );
}
