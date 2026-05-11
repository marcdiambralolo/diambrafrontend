import { api } from "@/lib/api/client";
import { User } from "@/lib/interfaces";


export async function getConsultantInfoById(mediumId: string): Promise<User> {
  // Appel API pour récupérer les infos du consultant
  // L'endpoint doit retourner { nom, prenoms, spiritualName, fullName, username, presentation, bio, photo, profilePicture, avatar }
  const { data } = await api.get(`/consultants/${mediumId}`);
  return data as User;
}
