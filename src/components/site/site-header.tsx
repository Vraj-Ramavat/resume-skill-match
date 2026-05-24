"use client";

import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center">
          <Image
            src={encodeURI('/MindHatch Logo.png')}
            alt="MindHatch"
            width={144}
            height={48}
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              if (target.src.includes('MindHatch%20Logo.png') || target.src.includes('MindHatch Logo.png')) {
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
