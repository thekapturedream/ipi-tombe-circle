"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { auth, firebaseReady } from "@/lib/firebase";

export default function SignInForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signInWithGoogle() {
    if (!auth) {
      router.push("/admin");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/admin");
    } catch {
      setMessage("That sign-in did not complete. Check that this account has admin access.");
      setBusy(false);
    }
  }

  async function signInWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) {
      router.push("/admin");
      return;
    }
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(
        auth,
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
      );
      router.push("/admin");
    } catch {
      setMessage("The email or password was not recognised.");
      setBusy(false);
    }
  }

  return (
    <main className="signin-page">
      <section className="signin-art">
        <Link href="/" className="signin-back">
          <ArrowLeft size={17} /> Back to the Circle
        </Link>
        <div className="signin-art__content">
          <Wordmark />
          <h1>Keep the Circle beautifully in motion.</h1>
          <p>
            Manage maker profiles, enquiries, opening updates and the living
            archive from one calm place.
          </p>
        </div>
      </section>
      <section className="signin-panel">
        <div className="signin-card">
          <LockKeyhole />
          <h2>Circle admin</h2>
          <p>Sign in with an approved administrator account.</p>
          {!firebaseReady && (
            <div className="demo-notice">
              Firebase is ready to connect. Until environment keys are added,
              this opens the fully working local demo.
            </div>
          )}
          <button
            className="button button--primary signin-google"
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
          >
            {firebaseReady ? "Continue with Google" : "Open admin demo"}
            <ArrowRight size={18} />
          </button>
          {firebaseReady && (
            <>
              <div className="signin-divider"><span>or use email</span></div>
              <form onSubmit={signInWithEmail}>
                <label>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@example.com"
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                  />
                </label>
                <button className="button button--outline" disabled={busy}>
                  Sign in <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}
          {message && <p className="signin-error">{message}</p>}
        </div>
      </section>
    </main>
  );
}
