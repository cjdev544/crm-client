import Link from 'next/link';

const ButtonCreate = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
        {children}
      </a>
    </Link>
  );
};

export default ButtonCreate;
