import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-20 bg-white backdrop-blur-md border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Image
              src="https://cdn.subconsciousvalley.workers.dev/legend.png"
              alt="Legend"
              width={50}
              height={50}
              className="rounded-lg"
            />
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-black hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/session"
              className="text-black hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Session
            </Link>
            <Link href="/blog" className="text-black hover:text-gray-300 px-3 py-2 text-sm font-medium">
              Blog
            </Link>
            {/* <Link href="/contact" className="text-black hover:text-gray-300 px-3 py-2 text-sm font-medium">
              Contact Us
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
