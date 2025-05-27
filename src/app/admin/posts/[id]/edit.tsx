'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

// Redirect to the proper edit page
export default function EditPostRedirect({ params }: EditPostPageProps) {
  const router = useRouter();
  
  useEffect(() => {
    router.replace(`/admin/posts/${params.id}/edit`);
  }, [params.id, router]);

  return null;
}
