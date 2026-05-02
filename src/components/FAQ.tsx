import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  /** When true, the FAQPage JSON-LD is NOT rendered here (parent renders it via useDocumentMeta). */
  noSchema?: boolean;
}

/**
 * Accessible FAQ accordion. Auto-injects FAQPage JSON-LD so Google can
 * surface answers in AI Overviews and rich results.
 */
export default function FAQ({ items, title = 'Frequently Asked Questions', noSchema = false }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight text-center">{title}</h2>

        <div className="space-y-2">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium text-sm sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1 text-white/55 text-sm leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQPage structured data for AI Overviews */}
      {!noSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: items.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}

/**
 * Helper to convert FAQ items into FAQPage JSON-LD for use with useDocumentMeta.
 */
export function faqJsonLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
