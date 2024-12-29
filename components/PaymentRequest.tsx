"use client";

import { useState, useEffect } from "react";

export default function MigrationNotice() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline:any = new Date(Date.UTC(2024, 11, 31, 23, 59, 59)); // December 31, 2024, 23:59:59 UTC
      const now:any = new Date();
      const difference = deadline - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Deadline reached!");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">
        Important Migration Notice
      </h1>
      <p className="mb-6 text-lg text-gray-700">
        We are transitioning from <strong>Next.js 14</strong> to{" "}
        <strong>Next.js 15</strong> for improved performance and features.
      </p>
      <p className="mb-4 text-lg font-semibold text-red-600">
        The migration must be completed before the end of 2024, by UTC time.
      </p>
      <p className="mb-6 text-lg font-medium text-gray-800">
        Time remaining: <strong>{timeLeft}</strong>
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">For Owners:</h2>
        <p className="mb-4 text-gray-700">
          You can find the migration steps in the official documentation.
        </p>
        <a
          href="https://nextjs.org/docs/app/building-your-application/upgrading/version-15"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition rounded-md"
        >
          Go to Documentation
        </a>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">For Visitors:</h2>
        <p className="mb-4 text-gray-700">
          Please contact the administrator for further assistance.
        </p>
        <a
          href="mailto:christianinja3@gmail.com"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Contact Administrator
        </a>
      </div>

      <p className="mt-8 text-gray-500 text-sm">Thanks for hosting with us.</p>
    </div>
  );
}
