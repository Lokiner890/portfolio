import { Link } from '../ui';

export const Header = () => {
  return (
    <header className=" w-screen py-6 px-8 flex items-center justify-around">
      <Link className="text-xl font-semibold">About Me</Link>
      <Link className="text-xl font-semibold">Projects</Link>
      <Link className="text-xl font-semibold">Skills</Link>
      <Link className="text-xl font-semibold">Contact Me</Link>
    </header>
  );
};
