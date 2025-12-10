import Link from 'next/link';
import styles from './NavLinks.module.css';

const links = [
  { href: '/', label: 'Home' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/atendimento', label: 'Atendimento' },
];

const NavLinks = () => {
  return (
    <nav className={styles.navigation}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={styles.navLink}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;