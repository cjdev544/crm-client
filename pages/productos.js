import { gql, useQuery } from '@apollo/client';
import ButtonCreate from 'components/ButtonCreate';
import Product from 'components/Product';

const GET_PRODUCTS = gql`
  query getAllProducts {
    getAllProducts {
      id
      name
      stock
      price
    }
  }
`;

const Products = () => {
  const { data, loading } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-bold">Productos</h1>

      <ButtonCreate href="/nuevoproducto">Nuevo Producto</ButtonCreate>

      <table className="table-auto shadow-md mt-10 w-full w-lg">
        <thead className="bg-gray-800">
          <tr className="text-white">
            <th className="w-1/5 py-2">Nombre</th>
            <th className="w-1/5 py-2">Precio</th>
            <th className="w-1/5 py-2">Disponibles</th>
            <th className="w-1/5 py-2">Eliminar</th>
            <th className="w-1/5 py-2">Editar</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.getAllProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Products;
