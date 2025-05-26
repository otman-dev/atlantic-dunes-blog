import Link from 'next/link';
import { getPublishedPostsServer } from '@/lib/utils/fileSystem';

export default async function PostsPage() {
  const posts = await getPublishedPostsServer();

  // Sort posts by creation date, most recent first
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group posts by category
  const postsByCategory = sortedPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const categories = Object.keys(postsByCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Publications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre expertise à travers nos articles techniques et nos solutions environnementales. 
            Atlantic Dunes partage son savoir-faire dans les domaines de l'éco-construction, 
            du traitement de l'eau, de la gestion des déchets et des énergies renouvelables.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{posts.length}</div>
            <div className="text-gray-600">Articles Publiés</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
            <div className="text-gray-600">Domaines d'Expertise</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
            <div className="text-gray-600">Pôles Techniques</div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Domaines d'Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-gray-900">{category}</div>
                  <div className="text-sm text-gray-600">
                    {postsByCategory[category].length} article{postsByCategory[category].length > 1 ? 's' : ''}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Posts by Category */}
        {categories.map((category) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, '-')}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {postsByCategory[category].length} article{postsByCategory[category].length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {postsByCategory[category].map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <time className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Par <span className="font-medium">{post.author}</span>
                      </div>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        Lire la suite
                        <svg
                          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
