"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { APP_NAME } from "@/lib/constants";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center ">
      <Image priority={true} src="/next.svg" width={48} height={48} alt={`${APP_NAME} logo`} />

      <div className="w-1/3 rounded-lg p-6 text-center shadow-md">
        <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
        <p className="text-destructive">Could not find requested resource</p>

        <Button
          variant="outline"
          className="ml-2 mt-4"
          onClick={() => (window.location.href = "/")}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
