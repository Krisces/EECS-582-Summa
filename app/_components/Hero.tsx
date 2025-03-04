import Image from 'next/image'
import React from 'react'

function Hero() {
  return (
    <section className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center lg:justify-center h-full">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-violet-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Your Finances, Tailored to You
          </h1>
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-violet-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl sm:block">
            Analyze, Plan, Prosper
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Get Started on Your Financial Journey
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded border border-violet-600 bg-violet-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              href="/sign-in"
            >
              Get Started
            </a>

            <a
              className="block w-full rounded border border-violet-600 px-12 py-3 text-sm font-medium text-white hover:bg-violet-600 focus:outline-none focus:ring active:bg-violet-600 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
