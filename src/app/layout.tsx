import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/app/components/organisms/Header/Header';
import Footer from '@/app/components/organisms/Footer/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Afulink',
  description: 'Website da Afulink',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}