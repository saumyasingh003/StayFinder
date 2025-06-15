import React from "react";
import home from "../assets/home.jpg";

const Landing = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Full-screen image */}
      <img src={home} alt="Cozy Crib" className="w-full h-full object-cover " />

      {/* Centered button over the image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <p className="text-white sm:text-9xl  text-7xl mb-10 font-serif italic">
          StayFinder
        </p>
        <a href="/home" className="bg-white text-black px-8 py-3 rounded-full shadow-lg hover:bg-gray-200 transition animate-bounce">
          Click Me
        </a>
      </div>
    </div>
  );
};

export default Landing;
