import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
  query getUser {
    getUser {
      name
    }
  }
`;

const Header = () => {
  const router = useRouter();

  const { data, loading } = useQuery(GET_USER);

  const logout = () => {
    localStorage.removeItem('crm-token');
    router.push('/login');
  };

  return (
    <div className="flex justify-between mb-6">
      <p className="mr-2">Hola: {!loading && data.getUser.name}</p>

      <button
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rpunded py-1 px-2 text-white shadow-md"
        onClick={logout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
