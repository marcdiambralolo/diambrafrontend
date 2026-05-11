'use client';
import { NewUserForm } from '@/components/admin/users/new/NewUserForm';
import { NewUserHeader } from '@/components/admin/users/new/NewUserHeader';
import { NewUserToast } from '@/components/admin/users/new/NewUserToast';
import { useNewUserPage } from '@/hooks/admin/users/useNewUserPage';

export default function NewUserPageClient() {
  const {
    formData, saving, toast, isFormValid, errors, setToast, handleChange, handleSubmit,
  } = useNewUserPage();

  return (
    <div className="mx-auto w-full max-w-4xl bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-3 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] sm:p-4 md:p-6">
      <NewUserHeader />

      <NewUserToast toast={toast} onClose={() => setToast(null)} />

      <NewUserForm
        formData={formData}
        errors={errors}
        saving={saving}
        isFormValid={!!isFormValid}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}