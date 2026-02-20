import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface SessionWithId {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

export async function auth(request?: any): Promise<SessionWithId | null> {
  const session = await getServerSession(authOptions);
  if (session && session.user && (session.user as any).id) {
    return session as SessionWithId;
  }
  return null;
}
