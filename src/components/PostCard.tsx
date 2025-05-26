import Link from 'next/link';
import { Post } from '@/lib/data';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600">
          <Link href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <Link 
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
