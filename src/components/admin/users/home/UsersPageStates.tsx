'use client';
import UsersErrorState from "@/components/admin/users/home/UsersErrorState";
import UsersLoading from "@/components/admin/users/home/UsersLoading";

type UsersErrorStateProps = React.ComponentProps<typeof UsersErrorState>;

export function UsersPageError({ error, handleRefresh, isRefreshing }: UsersErrorStateProps) {
  
  return (
    <UsersErrorState
      error={error}
      handleRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    />
  );
}

export function UsersPageLoading() {
  return <UsersLoading />;
}