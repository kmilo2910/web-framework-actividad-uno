import './globals.css';
import { I18nProvider } from '@/i18n/provider';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export const metadata = { title: 'Nexus', description: 'Biblioteca y coworking universitario' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Auth0Provider>
          <I18nProvider>{children}</I18nProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
