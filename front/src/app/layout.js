import './globals.css';

export const metadata = { title: 'Nexus', description: 'Biblioteca y coworking universitario' };

export default function RootLayout({ children }) {
  return <html lang="es"><body>{children}</body></html>;
}
