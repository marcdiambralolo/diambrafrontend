 
import { Star, Hash, Flame, Sparkles, BookOpen, EyeIcon } from "lucide-react";
import { CategoryType } from "./useProfilUser";
//import { CategoryType } from "./useProfilUser";

export const useProfilCategories = () => {
  const availabilityNow = "Accessible maintenant";

  const categories: CategoryType[] = [
    {
      id: "astrologie",
      title: "ASTROLOGIE",
      subtitle: "Lecture cosmique",
      icon: Star,
      color: "from-blue-500 to-indigo-500",
      gradient: "from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40",
      badge: "Populaire",
      badgeColor: "bg-blue-500",
      description: "Explore les influences cosmiques qui façonnent ta destinée",
      link: "/star/category/695ab7ee53c5ed748115c405",
      stats: availabilityNow,
    },
    {
      id: "numerologie",
      title: "NUMÉROLOGIE",
      subtitle: "Science des nombres",
      icon: Hash,
      color: "from-yellow-500 to-orange-500",
      gradient: "from-yellow-100/80 to-orange-100/80 dark:from-yellow-900/40 dark:to-orange-900/40",
      badge: "Mystique",
      badgeColor: "bg-yellow-500",
      description: "Décode les mystères cachés dans tes nombres personnels",
      link: "/star/category/695af1a645093bdb62a3b274",
      stats: availabilityNow,
    },
    {
      id: "spiritualite",
      title: "TESTAMENT DE LA CONNAISSANCE",
      subtitle: "Enseignements sacrés",
      icon: Flame,
      color: "from-orange-500 to-pink-500",
      gradient: "from-orange-100/80 to-pink-100/80 dark:from-orange-900/40 dark:to-pink-900/40",
      badge: "Authentique",
      badgeColor: "bg-orange-600",
      description: "Connecte-toi aux forces invisibles et aux ancêtres",
      link: "/star/blog",
      stats: "Grade 2 minimum",
      minGradeLevel: 2,
      lockedToastMessage: "Cette rubrique est accessible à partir du grade 2!",
    },
    {
      id: "invocations",
      title: "RITUELS SACRÉS",
      subtitle: "Activation spirituelle",
      icon: Sparkles,
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40",
      badge: "Puissant",
      badgeColor: "bg-green-500",
      description: "Pratiques ésotériques pour manifester tes intentions",
      link: "/star/category/698097de64e1795c57a7d9f3",
      stats: availabilityNow,
    },
    {
      id: "marche",
      title: "GUIDANCE",
      subtitle: "Consultation directe",
      icon: EyeIcon,
      color: "from-red-500 to-pink-500",
      gradient: "from-red-100/80 to-pink-100/80 dark:from-red-900/40 dark:to-pink-900/40",
      badge: "Nouveauté",
      badgeColor: "bg-red-500",
      description: "Discute avec un(e) Voyant(e) ou un(e) guide spirituel(le)",
      link: "/star/voyance/disclaimer",
      stats: availabilityNow,
    },
    {
      id: "librairie",
      title: "LIBRAIRIE ÉSOTÉRIQUE",
      subtitle: "Livres et manuscrits",
      icon: BookOpen,
      color: "from-cyan-500 to-teal-500",
      gradient: "from-cyan-100/80 to-teal-100/80 dark:from-cyan-900/40 dark:to-teal-900/40",
      badge: "Best-seller",
      badgeColor: "bg-cyan-500",
      description: "Collection de livres sacrés et guides spirituels",
      link: "/star/livres",
      stats: availabilityNow,
    },
  ];

  return categories;
};
