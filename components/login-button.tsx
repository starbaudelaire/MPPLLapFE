import { FaG } from "react-icons/fa6";
import { signIn } from "@/auth";

async function handleSignIn() {
  "use server";
  await signIn("google");
}

export const LoginGoogleButton = () => {
  return (
    <form action={handleSignIn}>
      <button
        type="submit"
        className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white font-semibold py-3 px-6 text-base rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        <FaG className="size-5" />
        Sign In
      </button>
    </form>
  );
};

export default LoginGoogleButton;
