"use client"; // Adicione esta linha no topo

import { useState } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg'; // Ícones de menu e fechar
import Logo from '@/app/components/atoms/Logo/Logo';
import NavLinks from '@/app/components/molecules/NavLinks/NavLinks';
import styles from './Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />

        {/* Navegação para Desktop */}
        <div className={styles.desktopNav}>
          <NavLinks />
        </div>

        {/* Botão do Menu Mobile */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <CgClose size={24} /> : <CgMenu size={24} />}
        </button>

        {/* Navegação Mobile (Dropdown) */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNavContainer}>
            <NavLinks />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;