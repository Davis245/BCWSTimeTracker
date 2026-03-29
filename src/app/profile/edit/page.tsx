import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/components/ProfileEditForm";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
        <p className="text-zinc-600">You are not signed in.</p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { crew: true } });
  const firstName = dbUser?.firstName ?? "";
  const lastName = dbUser?.lastName ?? "";
  const email = dbUser?.email ?? session.user.email ?? "";
  const crewCode = dbUser?.crew?.crewCode ?? "";

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-md">
        <ProfileEditForm firstName={firstName} lastName={lastName} email={email} crew={crewCode} />
      </div>
    </div>
  );
}
