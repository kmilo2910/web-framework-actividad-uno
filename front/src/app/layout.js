import './globals.css';
import { I18nProvider } from '@/i18n/provider';

export const metadata = { title: 'Nexus', description: 'Biblioteca y coworking universitario' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
