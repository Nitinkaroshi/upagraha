import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

const posts: BlogPost[] = [
  {
    slug: 'fcc-5-year-deorbit-rule-compliance-guide',
    title: 'Complete Guide to FCC 5-Year Deorbit Compliance',
    excerpt: 'The FCC now requires all LEO satellites to deorbit within 5 years of mission end. Here\'s everything satellite operators need to know about the new rule, how to calculate your orbital lifetime, and how to demonstrate compliance.',
    date: '2026-03-30',
    readTime: '8 min',
    tags: ['Compliance', 'FCC', 'Regulations'],
  },
  {
    slug: 'what-is-kessler-syndrome',
    title: 'What is Kessler Syndrome and Why Should You Care?',
    excerpt: 'A chain reaction of orbital collisions could render Low Earth Orbit unusable. We explain the science, the current risk level, and what the space industry is doing about it.',
    date: '2026-03-28',
    readTime: '6 min',
    tags: ['Space Debris', 'Education'],
  },
  {
    slug: 'orbital-lifetime-calculation-explained',
    title: 'How Orbital Lifetime Calculations Work: A Technical Guide',
    excerpt: 'Understanding atmospheric drag, solar activity, and ballistic coefficients. A practical guide for satellite engineers and mission planners.',
    date: '2026-03-25',
    readTime: '10 min',
    tags: ['Technical', 'Orbital Mechanics'],
  },
];

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white/[0.02] border border-white/[0.06] rounded-xl p-7 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-[10px] font-medium uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors leading-tight">
        {post.title}
      </h2>

      <p className="text-white/30 text-sm leading-relaxed mb-5">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-white/20 text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <span className="text-white/30 text-sm font-medium group-hover:text-white group-hover:gap-2 inline-flex items-center gap-1 transition-all">
          Read <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Blog</h1>
          <p className="text-white/35">
            Technical guides, regulatory updates, and insights on space sustainability.
          </p>
        </div>

        <div className="space-y-5">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
