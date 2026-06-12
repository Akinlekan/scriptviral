import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <Link href="/" className="mb-8 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">ScriptViral</span>
            </Link>
            <AuthForm mode="signup" />
        </div>
    );
}
