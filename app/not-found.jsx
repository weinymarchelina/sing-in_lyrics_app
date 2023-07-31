"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after 3 seconds (you can change the delay if you want)
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearTimeout(redirectTimer); // Clear the timer when the component unmounts
    };
  }, [router]);

  return (
    <>
      <h1>404 - Page Not Found~</h1>
      {/* You can also show a message here like "Redirecting to homepage..." */}
    </>
  );
}
