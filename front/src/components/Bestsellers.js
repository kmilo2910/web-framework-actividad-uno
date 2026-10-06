import BestsellerList from '@/components/BestsellerList';
import { cookies } from 'next/headers';
import { normalizeLanguage } from '@/i18n/config';

export default async function Bestsellers() {
  const language = normalizeLanguage((await cookies()).get('nexus-locale')?.value);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/bestsellers/top?lang=${language}`,
    {
      next: { revalidate: 300, tags: ['bestsellers'] },
    }
  );
  const books = response.ok ? (await response.json()).slice(0, 3) : [];
  return <BestsellerList books={books} />;
}
