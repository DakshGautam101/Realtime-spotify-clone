import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";
import SignInForm from "@/components/SignInOAuthButtons"; // This is your combined SignIn/SignUp form
import { Card, CardContent } from "@/components/ui/card";

const AuthPage = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardContent className="py-8">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
