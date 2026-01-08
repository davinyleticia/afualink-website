"use client";

import { useState, useEffect } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg';
import Logo from '@/components/atoms/Logo/Logo';
import NavLinks from '@/components/molecules/NavLinks/NavLinks';
import styles from './Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Lado Esquerdo: Logo */}
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        {/* Lado Direito: Nav Desktop */}
        <nav className={styles.desktopNav}>
          <NavLinks />
        </nav>

        {/* Lado Direito: Botão Mobile (visível apenas em telas pequenas) */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CgClose size={28} /> : <CgMenu size={28} />}
        </button>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNavContainer}>
            <NavLinks onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;