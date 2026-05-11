'use client';
import { UsersPageContent } from '@/components/admin/users/home/UsersPageContent';

export default function UsersPageClient() {

  return (
    <main aria-labelledby="admin-users-title" className="w-full">
      <h1 id="admin-users-title" className="sr-only">Gestion des utilisateurs</h1>
      <UsersPageContent />
    </main>
  );
}