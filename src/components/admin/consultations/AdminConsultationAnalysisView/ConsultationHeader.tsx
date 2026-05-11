export default function ConsultationHeader({ title }: { title: string; }) {

  return (
    <div className="theme-dark-panel rounded-2xl bg-gradient-to-r from-blue-100 to-slate-100 p-6 shadow dark:from-[#0F1C3F] dark:to-[#162A56]">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-white">{title}</h2>
    </div>
  );
}