import Image from 'next/image';
import React from 'react';

export const Footer = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="py-4 px-8 w-full max-w-[1280px] mx-auto flex justify-between align-middle items-center">
        <div className="flex flex-col">
          <a
            href="https://github.com/densdix"
            className="inline-flex items-center  text-gray-400 hover:text-gray-500"
            target="_blank"
          >
            <Image width={32} height={32} src="/github.png" alt="github logo" className="mr-2" />
            densdix
          </a>
          <a
            href="https://github.com/evakerrigan"
            className="inline-flex items-center text-gray-400 hover:text-gray-500"
            target="_blank"
          >
            <Image width={32} height={32} src="/github.png" alt="github logo" className="mr-2" />
            evakerrigan
          </a>
          <a
            href="https://github.com/teymurdev"
            className="inline-flex items-center text-gray-400 hover:text-gray-500"
            target="_blank"
          >
            <Image width={32} height={32} src="/github.png" alt="github logo" className="mr-2" />
            teymurdev
          </a>
        </div>
        <div className="text-gray-400">2025</div>
        <div className="relative">
          <a href="https://rs.school" className="flex items-center space-x-2" target="_blank">
            <Image
              width={96}
              height={32}
              src="/rsschool-js-logo.webp"
              alt="RSS School JS logo"
              className="object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
