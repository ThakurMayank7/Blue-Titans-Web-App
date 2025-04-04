"use client";

import { useEffect, useState } from "react";
import GoogleLogo from "@/components/GoogleLogo";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/Spinner";
import { signInWithGoogle } from "@/firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isLogging, setIsLogging] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (!user && loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:py-8 md:max-w-6xl md:mx-auto">
      <div className="flex flex-col md:flex-row min-h-[500px] h-auto sm:h-[80vh] text-black bg-gradient-to-br from-amber-50/90 to-amber-100/90 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-xl border border-amber-200/50 overflow-hidden">
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 flex items-center justify-center order-2 md:order-1">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200 p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-800 text-center">
                Welcome!
              </h2>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 border border-red-200 text-sm sm:text-base">
                  {error}
                </div>
              )}

              {loading || user || isLogging ? (
                <div className="flex flex-col items-center gap-3">
                  <Spinner />
                  {isLogging && (
                    <button
                      className="text-amber-600 hover:text-amber-800 underline text-sm sm:text-base"
                      onClick={() => {
                        setIsLogging(false);
                      }}
                    >
                      Retry Login
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-white shadow-md rounded-full border border-gray-300
               transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 
               focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                    onClick={async () => {
                      setIsLogging(true);
                      setError(null);

                      try {
                        await signInWithGoogle();
                      } catch (err: unknown) {
                        console.error("Sign-in error:", err);
                        setError((err as Error).message);
                      } finally {
                        setIsLogging(false);
                      }
                    }}
                    disabled={isLogging}
                  >
                    <GoogleLogo width="24" height="24" />
                    <span className="font-medium text-gray-700">
                      {isLogging ? "Signing in..." : "Sign in with Google"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 flex items-center justify-center order-1 md:order-2">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl sm:rounded-2xl opacity-50"></div>
            <div className="relative z-10 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-amber-200">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-amber-800">
                🎵 Indian Classical Music
              </h2>

              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Sign in to access your personal music analyzer and explore the
                rich traditions of Indian classical music.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base">
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg sm:text-xl">
                    📊
                  </span>
                  <span>Track your music analysis history</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg sm:text-xl">
                    🔍
                  </span>
                  <span>Explore detailed insights about ragas and taals</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg sm:text-xl">
                    💾
                  </span>
                  <span>Save and organize your favorite recordings</span>
                </li>
              </ul>

              <p className="text-gray-700 font-medium mt-3 sm:mt-6 text-sm sm:text-base">
                Join our community of musicians and enthusiasts passionate about
                preserving and exploring this ancient art form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
