const descriptions = {
  'book-1': [
    'Una guía práctica para escribir código claro, mantenible y profesional.',
    'Manual esencial para crear software limpio y legible mediante principios de diseño y buenas prácticas.',
  ],
  'book-2': [
    'Una introducción moderna y completa a JavaScript y la programación web.',
    'Recorrido por JavaScript, desde sus fundamentos hasta la creación de aplicaciones web interactivas.',
  ],
  'book-3': [
    'Principios atemporales para desarrollar software de forma profesional.',
    'Prácticas para mejorar el diseño, la escritura y el mantenimiento del software durante toda la carrera.',
  ],
  'book-4': [
    'La obra clásica de Cervantes sobre las aventuras de un caballero idealista.',
    'Las aventuras de Don Quijote y Sancho Panza exploran los límites entre los ideales, la imaginación y la realidad.',
  ],
  'book-5': [
    'Un análisis profundo de los sistemas modernos de datos distribuidos.',
    'Explica arquitecturas de datos, escalabilidad, replicación, particionamiento, consistencia y procesamiento de información.',
  ],
  'book-6': [
    'Una guía para mejorar el diseño del código existente sin cambiar su comportamiento.',
    'Martin Fowler presenta técnicas de refactorización para reducir la complejidad y mantener sistemas evolutivos.',
  ],
  'book-7': [
    'Una introducción clara a los fundamentos internos de JavaScript.',
    'Kyle Simpson explica los conceptos que permiten comprender mejor el comportamiento del lenguaje y escribir código más sólido.',
  ],
  'book-8': [
    'Un código de conducta para programadores profesionales.',
    'Reflexiona sobre disciplina, responsabilidad, comunicación y las prácticas necesarias para construir software de calidad.',
  ],
  'book-9': [
    'Patrones para diseñar aplicaciones empresariales mantenibles.',
    'Catálogo de soluciones para organizar capas, objetos, datos y procesos en sistemas empresariales complejos.',
  ],
  'book-10': [
    'Una referencia para gestionar la complejidad de los dominios de negocio.',
    'Expone técnicas de diseño orientado al dominio para conectar el modelo de software con las reglas reales de una organización.',
  ],
  'book-11': [
    'Una mirada al diseño de los objetos y servicios que usamos cada día.',
    'Don Norman explica cómo el diseño, la visibilidad y la retroalimentación influyen en la experiencia de las personas.',
  ],
  'book-12': [
    'Una historia breve de la humanidad y sus grandes transformaciones.',
    'Recorre revoluciones cognitivas, agrícolas y científicas para explicar cómo las sociedades llegaron al mundo actual.',
  ],
  'book-13': [
    'Una saga familiar marcada por el amor, la memoria y la soledad.',
    'La familia Buendía atraviesa varias generaciones en Macondo, donde la historia y lo fantástico conviven.',
  ],
  'book-14': [
    'Una fábula poética sobre la amistad, el amor y la responsabilidad.',
    'El viaje del principito por distintos planetas ofrece una mirada sensible sobre las relaciones y la forma de ver el mundo.',
  ],
  'book-15': [
    'El poema épico sobre el largo regreso de Odiseo a Ítaca.',
    'Homero narra un viaje de aventuras, astucia y resistencia frente a dioses, monstruos y mares desconocidos.',
  ],
  'mag-1': [
    'Una revista divulgativa dedicada a los grandes acontecimientos de la historia.',
    'Explora personajes, culturas y transformaciones que han marcado la historia de la humanidad con rigor y narrativa visual.',
  ],
};

const languageIntro = {
  en: [
    'A concise guide for readers interested in software, literature and history.',
    'This publication presents its subject with practical context and accessible explanations.',
  ],
  fr: [
    'Un guide concis pour les lecteurs intéressés par le logiciel, la littérature et l’histoire.',
    'Cette publication présente son sujet avec un contexte pratique et des explications accessibles.',
  ],
  it: [
    'Una guida concisa per chi è interessato a software, letteratura e storia.',
    'Questa pubblicazione presenta il suo tema con un contesto pratico e spiegazioni accessibili.',
  ],
  de: [
    'Ein kompakter Leitfaden für Leserinnen und Leser, die sich für Software, Literatur und Geschichte interessieren.',
    'Diese Publikation vermittelt ihr Thema mit praktischem Kontext und verständlichen Erklärungen.',
  ],
};

export const bookTranslationsCatalog = Object.fromEntries(
  Object.entries(descriptions).map(([id, [shortEs, longEs]]) => {
    const languages = { es: { shortDescription: shortEs, longDescription: longEs } };
    for (const [language, [shortPrefix, longPrefix]] of Object.entries(languageIntro)) {
      languages[language] = {
        shortDescription: shortPrefix,
        longDescription: longPrefix,
      };
    }
    return [id, languages];
  })
);
