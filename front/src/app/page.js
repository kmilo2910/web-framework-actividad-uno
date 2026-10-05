import Link from 'next/link';

export default function HomePage() {
  return <main className="landing"><section className="hero"><p className="eyebrow">NEXUS UNIVERSIDAD</p><h1>Tu espacio para aprender, crear y compartir.</h1><p className="lead">Accede a la biblioteca universitaria y reserva espacios de coworking desde un solo lugar.</p><Link className="button" href="/login">Iniciar sesión</Link></section><section className="cards"><article><span>01</span><h2>Biblioteca</h2><p>Descubre libros, revistas y tus adquisiciones.</p></article><article><span>02</span><h2>Coworking</h2><p>Encuentra un espacio disponible y resérvalo.</p></article></section></main>;
}
