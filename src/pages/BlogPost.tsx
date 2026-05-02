import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { articles, articleList } from '@/content/articles';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug] : null;

  useDocumentMeta({
    title: article ? `${article.title} | Upagraha` : 'Article — Upagraha',
    description: article
      ? article.excerpt
      : 'Space debris and compliance article on Upagraha.',
    canonical: slug ? `https://upagraha-ten.vercel.app/blog/${slug}` : undefined,
    type: 'article',
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: article.date,
          author: { '@type': 'Person', name: 'Nitin Karoshi', url: 'https://github.com/Nitinkaroshi' },
          publisher: {
            '@type': 'Organization',
            name: 'Upagraha',
            logo: { '@type': 'ImageObject', url: 'https://upagraha-ten.vercel.app/og-default.svg' },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://upagraha-ten.vercel.app/blog/${slug}` },
          url: `https://upagraha-ten.vercel.app/blog/${slug}`,
        }
      : undefined,
  });

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article not found</h1>
          <Link to="/blog" className="text-white/50 hover:text-white transition-colors">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  // Surface up to 3 related posts (matching tags)
  const related = articleList
    .filter((p) => p.slug !== article.slug && p.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to blog
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-white/25 text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/30">Last reviewed {new Date(article.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white/80 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-white/40 [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:text-white/40 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5
            [&_ol]:text-white/40 [&_ol]:space-y-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
            [&_li]:leading-relaxed
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/20 hover:[&_a]:decoration-white/50
            [&_code]:text-white/60 [&_code]:bg-white/[0.04] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-white/[0.04] [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-xs
            [&_pre_code]:bg-transparent [&_pre_code]:px-0
            [&_table]:w-full [&_table]:text-sm [&_table]:mb-4
            [&_th]:text-white/50 [&_th]:text-left [&_th]:pb-2 [&_th]:border-b [&_th]:border-white/[0.08] [&_th]:font-medium
            [&_td]:text-white/40 [&_td]:py-2 [&_td]:border-b [&_td]:border-white/[0.04]
            [&_hr]:border-white/[0.06] [&_hr]:my-8
            [&_em]:text-white/30 [&_em]:not-italic
          "
          dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
        />

        {/* CTA */}
        <div className="mt-16 bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Try Our Free Tools</h3>
          <p className="text-white/30 text-sm mb-6 max-w-md mx-auto">
            Calculate orbital lifetimes, check regulatory compliance, and explore the orbital environment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/lifetime-calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all text-sm"
            >
              Lifetime Calculator
            </Link>
            <Link
              to="/deorbit-advisor"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] text-white border border-white/[0.1] rounded-lg hover:bg-white/[0.1] transition-all text-sm"
            >
              Deorbit Advisor
            </Link>
            <Link
              to="/satellites-over-you"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] text-white border border-white/[0.1] rounded-lg hover:bg-white/[0.1] transition-all text-sm"
            >
              Satellites Over You
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-white/[0.06] pt-10">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-5">Related articles</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-colors"
                >
                  <h4 className="text-white text-sm font-semibold leading-snug mb-2">{rel.title}</h4>
                  <div className="text-[11px] text-white/30 flex items-center gap-3">
                    <span>{rel.readTime}</span>
                    <span>·</span>
                    <span>{new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

/** Very simple markdown-to-HTML (handles what we need) */
function markdownToHtml(md: string): string {
  return md
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => `<pre><code>${escapeHtml(code)}</code></pre>`)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('<li>')) return `<ul>${match}</ul>`;
      return match;
    })
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\*(.+)\*$/gm, '<em>$1</em>')
    .replace(/^(?!<[a-z])((?!^$).+)$/gm, '<p>$1</p>')
    .replace(/\n\n+/g, '\n');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
