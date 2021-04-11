import { gql, useQuery } from '@apollo/client';
import ButtonCreate from 'components/ButtonCreate';
import Client from 'components/Client';
import { useRouter } from 'next/router';

const GET_CLIENTS_USER = gql`
  query getClientsBySeller {
    getClientsBySeller {
      id
      name
      lastName
      company
      email
    }
  }
`;

const Home = () => {
  const router = useRouter();

  const { data, loading } = useQuery(GET_CLIENTS_USER);

  if (loading) return <p>Cargando...</p>;

  if (!data.getClientsBySeller[0]) {
    router.push('/login');
    return <p>cargando...</p>;
  }

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-bold">Clientes</h1>

      <ButtonCreate href="/nuevocliente">Nuevo Cliente</ButtonCreate>

      <table className="table-auto shadow-md mt-10 w-full w-lg">
        <thead className="bg-gray-800">
          <tr className="text-white">
            <th className="w-1/5 py-2">Nombre</th>
            <th className="w-1/5 py-2">Empresa</th>
            <th className="w-1/5 py-2">Email</th>
            <th className="w-1/5 py-2">Eliminar</th>
            <th className="w-1/5 py-2">Editar</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.getClientsBySeller.map((client) => (
            <Client key={client.id} client={client} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
