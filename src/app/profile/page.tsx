import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import EditProfileButton from "@/components/EditProfileButton";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p className="text-zinc-600">You are not signed in.</p>
      </div>
    );
  }

  const { user } = session;

  // Fetch richer user info (first/last name, crew) from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { crew: true },
  });

  const firstName = dbUser?.firstName ?? (user.name ? user.name.split(" ").slice(0, -1).join(" ") || user.name : "");
  const lastName = dbUser?.lastName ?? (user.name ? user.name.split(" ").slice(-1).join(" ") : "");
  const email = dbUser?.email ?? user.email ?? "";
  const crewName = dbUser?.crew?.name ?? "-";

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4 text-center">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-md text-center">
  <div className="grid grid-cols-1 gap-y-6 mb-6">
          <div>
            <div className="text-xs text-zinc-400">First name</div>
            <div className="font-medium">{firstName || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Last name</div>
            <div className="font-medium">{lastName || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Email</div>
            <div className="font-medium">{email || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Crew</div>
            <div className="font-medium">{crewName}</div>
          </div>
        </div>

        <div className="mt-12 flex gap-3">
          <EditProfileButton className="flex-1" />
          <SignOutButton className="flex-1" />
        </div>
      </div>
    </div>
  );
}
