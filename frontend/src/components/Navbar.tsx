import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";

export const Navbar = () => {
  return (
    <nav className="fixed flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <nav
          className="w-full rounded-md flex justify-between"
          aria-label="breadcrumb"
        >
          <ol className="list-reset ml-2 flex">
            <li>
              <Link
                to="/"
                className="text-neutral-500 transition duration-200 hover:text-neutral-600 hover:ease-in-out motion-reduce:transition-none dark:text-neutral-200"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2 text-neutral-500 dark:text-neutral-200">
                /
              </span>
            </li>
            <li>
              <Link
                to="/"
                className="text-neutral-500 transition duration-200 hover:text-neutral-600 hover:ease-in-out motion-reduce:transition-none dark:text-neutral-200"
              >
                Library
              </Link>
            </li>
            <li>
              <span className="mx-2 text-neutral-500 dark:text-neutral-200">
                /
              </span>
            </li>
            <li>
              <Link
                to="/"
                className="text-neutral-500 transition duration-200 hover:text-neutral-600 hover:ease-in-out motion-reduce:transition-none dark:text-neutral-200"
              >
                Data
              </Link>
            </li>
          </ol>
          <div className="mr-2 flex">
            <BsThreeDots />
          </div>
        </nav>
      </div>
    </nav>
  );
};
