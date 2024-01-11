import { Link } from "@remix-run/react";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-indigo-600">
        <nav className="container mx-auto py-8 text-zinc-50 flex justify-between">
          <Link
            to="/"
            className="px-4 py-2  border-2 rounded-2xl hover:bg-indigo-700 ease-in-out"
          >
            lnk.ly
          </Link>
          <ul className="flex items-center">
            <li className="mr-4">
              <Link
                to="/"
                className="px-4 py-2  border-2 rounded-2xl hover:bg-indigo-700 ease-in-out"
              >
                Home
              </Link>
            </li>
            <li className="mr-4">
              <Link
                to="/links"
                className="px-4 py-2  border-2 rounded-2xl hover:bg-indigo-700 ease-in-out"
              >
                All Links
              </Link>
            </li>
            <li className="mr-4">
              <Link
                to="/"
                className="px-4 py-2  border-2 rounded-2xl hover:bg-indigo-700 ease-in-out"
              >
                Log In
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
