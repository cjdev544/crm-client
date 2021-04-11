import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import Swal from 'sweetalert2';

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
    }
  }
`;
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

const Client = ({ client }) => {
  const { name, lastName, company, id, email } = client;

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      // Read cache
      const { getClientsBySeller } = cache.readQuery({
        query: GET_CLIENTS_USER,
      });
      // Write cache
      cache.writeQuery({
        query: GET_CLIENTS_USER,
        data: {
          getClientsBySeller: getClientsBySeller.filter(
            (client) => client.id !== id
          ),
        },
      });
    },
  });

  const removeClient = () => {
    Swal.fire({
      title: '¿Deseas eliminar este cliente?',
      text: 'Se borraran todos los datos del cliente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await confirmDeleteClient();
        if (res === id) {
          Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado correctamente',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: res,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  const confirmDeleteClient = async () => {
    try {
      const { data } = await deleteClient({
        variables: {
          id,
        },
      });
      return data.deleteClient.id;
    } catch (err) {
      return err.message;
    }
  };

  const editClient = () => {
    Router.push({
      pathname: '/editarcliente/[id]',
      query: { id },
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">
        {name} {lastName}
      </td>
      <td className="border px-4 py-2">{company}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold hover:bg-red-900"
          onClick={removeClient}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Eliminar
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold hover:bg-green-900"
          onClick={editClient}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Editar
        </button>
      </td>
    </tr>
  );
};

export default Client;
