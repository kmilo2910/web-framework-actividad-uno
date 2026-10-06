import Link from 'next/link';
import { ArrowUpRight, BookOpen, LibraryBig, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="landing">
      <header className="landing-header">
        <Link href="/" className="landing-brand">
          <span className="landing-logo">
            <BookOpen size={20} />
          </span>
          <span>
            <strong>Nexus</strong>
            <small>Campus digital</small>
          </span>
        </Link>
        <Link href="/login" className="landing-login">
          Iniciar sesión <ArrowUpRight size={16} />
        </Link>
      </header>
      <div className="landing-content">
        <section className="hero">
          <p className="eyebrow">NEXUS UNIVERSIDAD</p>
          <h1>Tu espacio para aprender, crear y compartir.</h1>
          <p className="lead">
            Accede a la biblioteca universitaria y reserva espacios de coworking desde un solo
            lugar.
          </p>
          <Link className="button" href="/login">
            Comenzar ahora <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="landing-visual" aria-label="Nexus campus digital">
          <div className="visual-orbit visual-orbit-one" />
          <div className="visual-orbit visual-orbit-two" />
          <div className="visual-card visual-card-main">
            <span className="visual-icon">
              <LibraryBig size={30} />
            </span>
            <span className="visual-kicker">Tu campus digital</span>
            <strong>Aprende a tu ritmo.</strong>
            <p>Recursos, espacios y comunidad en un mismo lugar.</p>
          </div>
          <div className="visual-card visual-card-float">
            <UsersRound size={18} />
            <span>Conecta y crea</span>
          </div>
        </section>
      </div>
    </main>
  );
}
