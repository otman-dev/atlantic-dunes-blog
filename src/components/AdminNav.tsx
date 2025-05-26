'use client';

import Link from 'next/link';

const adminRoutes = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts/create', label: 'Create Post' },
  { href: '/admin/categories', label: 'Categories' },
];

export default function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin Panel
            </Link>
          </div>
          
          <div className="flex space-x-4">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {route.label}
              </Link>
            ))}
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
