import Image from "next/image";
import React from "react";

import { BsThreeDots } from "react-icons/bs";

function PracticeWithAIPage() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200 p-4 md:p-6">
      <div className="flex items-center justify-center mt-8">
        <Image
          src={"/zakir-hussain.jpg"}
          alt="Avatar"
          width={128}
          height={128}
          className="rounded"
        />
      </div>

      <div>
        <h1 className="text-3xl text-center font-bold text-amber-900 mt-4">
          Practice with AI
        </h1>
        <p className="text-center text-gray-700 mt-2">
          Practice your skills with AI-generated reviews.
        </p>

        <div className="flex items-center justify-start mt-4">
          <span className="text-start text-6xl font-serif bg-amber-600/80 rounded-full px-4">
            <BsThreeDots className="text-amber-200" />
          </span>
        </div>
        <div className="flex items-center justify-end mt-4">
          <span className="text-end text-6xl font-serif bg-amber-600/80 rounded-full px-4">
            <BsThreeDots className="text-amber-200" />
          </span>
        </div>
        <p className="text-center mb-4 mt-4">
          <span className="text-2xl font-semibold bg-amber-500 px-4 py-2 rounded-full text-amber-900">
            Coming Soon...
          </span>
        </p>
      </div>
    </div>
  );
}

export default PracticeWithAIPage;
