'use client';
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Menu, X, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import nextlogo from '@public/next_noetics.png';
import Link from 'next/link';

interface NavigationProps {
  isFixed?: boolean;
  fontClass?: string;
}

const Navigation: React.FC<NavigationProps> = ({ isFixed = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className={`bg-white dark:bg-gray-950 z-50 pt-2 ${isFixed ? 'fixed top-0 left-0 w-full' : ''} dark:border-0 dark:border-b-zinc-950 shadow-2xl`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 pb-2 flex justify-between items-center">
        {/* Logo */}
        <span className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={nextlogo}
              alt="Noetics.io Logo"
              width={250}
              height={175}
              className="rounded-full"
            />
          </Link>
          <span className="md:hidden flex justify-end w-full mx-8 items-start gap-4">
            <DarkModeToggle />
          </span>
        </span>
        {/* Hamburger Menu for Smaller Screens */}
        <button
          className="sm:hidden text-zinc-800 dark:text-white hover:text-zinc-600"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-6">
          <li>
            <DarkModeToggle />
          </li>
          <li>
            <Link href="#services" className="hover:underline dark:text-white">
              Services
            </Link>
          </li>
          <li>
            <Link href="#portfolio" className="hover:underline dark:text-white">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="#about" className="hover:underline dark:text-white">
              About
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="onboardbutton bg-red-500 py-3 px-6 rounded-full"
              onClick={toggleMenu}
            >
              Login
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </Link>
          </li>
        </ul>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="absolute top-14 left-0 w-full bg-white dark:bg-zinc-900 shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">
            <li>
              <Link
                href="#about"
                className="hover:underline text-zinc-800 dark:text-white"
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className="hover:underline text-zinc-800 dark:text-white"
                onClick={toggleMenu}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="#portfolio"
                className="hover:underline text-zinc-800 dark:text-white"
                onClick={toggleMenu}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/login/"
                className="onboardbutton py-2 px-4 rounded-full"
                onClick={toggleMenu}
              >
                Login
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </motion.header>
  );
};

export default Navigation;