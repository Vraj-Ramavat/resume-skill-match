"use client";

import Image from 'next/image';
import React from 'react';

export function SiteHeader() {
  return (
    <header className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center">
          <img
            src={'/MindHatch Logo.png'}
            alt="MindHatch"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src.includes('MindHatch Logo.png')) {
                target.src = '/mindhatch-fallback.svg';
              }
            }}
            className="h-8 w-auto"
          />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
