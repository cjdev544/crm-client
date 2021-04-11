import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';

import ButtonInput from 'components/ButtonInput';
import InputForm from 'components/InputForm';
import FormError from 'components/FormError';

const CREATE_PRODUCT = gql`
  mutation createProduct($input: ProductInput) {
    createProduct(input: $input) {
      id
      name
      stock
      price
    }
  }
`;
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

const newProduct = () => {
  const router = useRouter();

  const { loading } = useQuery(GET_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    update(cache, { data: { createProduct } }) {
      // Read cache
      const { getAllProducts } = cache.readQuery({ query: GET_PRODUCTS });
      // Write cache
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getAllProducts: [...getAllProducts, createProduct],
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      stock: '',
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required('El nombre del producto debe ser unico y obligatorio'),
      price: yup.string().required('El precio es obligatorio'),
      stock: yup
        .string()
        .required('Es obligatorio saber la cantidad de productos disponibles'),
    }),
    onSubmit: async (values) => {
      const { name, price, stock } = values;
      try {
        await createProduct({
          variables: {
            input: {
              name,
              price,
              stock,
            },
          },
        });
        Swal.fire({
          icon: 'success',
          title: 'Producto creado correctamente',
          showConfirmButton: false,
          timer: 2000,
        });
        router.push('/productos');
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
  });

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-bold">Nuevo Producto</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <InputForm
              type="text"
              name="name"
              placeholder="Nombre de producto"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Nombre
            </InputForm>
            {formik.errors.name && formik.touched.name && (
              <FormError error={formik.errors.name} />
            )}

            <InputForm
              type="number"
              name="price"
              placeholder="Precio de producto"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Precio
            </InputForm>
            {formik.errors.price && formik.touched.price && (
              <FormError error={formik.errors.price} />
            )}

            <InputForm
              type="number"
              name="stock"
              placeholder="Cantidad de productos disponibles"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Cantidad de Productos
            </InputForm>
            {formik.errors.stock && formik.touched.stock && (
              <FormError error={formik.errors.stock} />
            )}

            <ButtonInput value="Crear Producto" />
          </form>
        </div>
      </div>
    </>
  );
};

export default newProduct;
