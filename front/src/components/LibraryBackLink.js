'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/provider';

export default function LibraryBackLink() {
  const { dictionary } = useI18n();
  return (
    <Link href="/library" className="flex items-center gap-2 text-sm font-semibold text-[#1f4f66]">
      <ArrowLeft size={16} /> {dictionary.library.backToLibrary}
    </Link>
  );
}
