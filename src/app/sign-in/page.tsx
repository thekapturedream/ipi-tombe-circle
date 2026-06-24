import type { Metadata } from "next";
import SignInForm from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInForm />;
}
