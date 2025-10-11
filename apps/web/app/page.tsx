import SplineComponent from "@/components/Spline";
import { Gugi } from "next/font/google";
import Link from "next/link";

const gugi = Gugi({ weight: "400", subsets: ["latin"] });

export default function App() {
  return (
    <>
    <div className={`${gugi.className} gugi-font overflow-hidden h-screen z-10 relative`}>
      {/* Ava on top left */}
      <span className="bg-transparent z-20 absolute top-4 left-4">
        <h1 className="text-4xl">AVA</h1>
      </span>
      
      {/* Sandbox and Sign up on top right */}
      <span className="bg-transparent z-20 absolute top-4 right-4 text-right">
        <Link href="/sandbox" className="text-md text-gray-700">Sandbox</Link>
        <p className="text-md text-gray-600">Sign up</p>
      </span>
      
      {/* Caption above email input */}
      <span className="z-30 absolute bottom-96 left-1/3 transform -translate-x-10">
        <h1 className="text-4xl">automation that makes sense</h1>
      </span>

      {/* Email input in lower center */}
      <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 z-20 absolute bottom-40 left-1/3 transform -translate-x-10 ">
        <input type="email" placeholder="Email" className="text-sm text-gray-800 px-6 py-6 bg-transparent border-none outline-none w-[45vw] " />
      </span>
      
      {/* Button to bottom right of inputs */}
      <span className="z-20 absolute bottom-16 right-[34%] transform translate-x-20">
        <button className="text-md text-white px-6 py-4 bg-[#4f4ff6] rounded-lg hover:bg-[#3333DD] transition-all duration-300">Join waiting list</button>
      </span>
      
      <SplineComponent />
    </div>
    </>
  );
}