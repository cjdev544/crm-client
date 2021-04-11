import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as yup from 'yup';

import InputForm from 'components/InputForm';
import ButtonInput from 'components/ButtonInput';
import FormError from 'components/FormError';
import Swal from 'sweetalert2';

const GET_PRODUCT = gql`
  query getProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      stock
      price
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation updateProduct($input: ProductUpdateInput) {
    updateProduct(input: $input) {
      id
      name
      stock
      price
    }
  }
`;

const UpdateProduct = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      id,
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const validationForm = yup.object({
    name: yup
      .string()
      .required('El nombre del producto debe ser unico y obligatorio'),
    price: yup.string().required('El precio es obligatorio'),
    stock: yup
      .string()
      .required('Es obligatorio saber la cantidad de productos disponibles'),
  });

  if (loading) return <p>Cargando...</p>;

  if (error) {
    router.replace('/productos');
    return <p>Datos del producto no encontrados</p>;
  }
  const { getProduct } = data;

  const handleSubmit = async (values) => {
    const { name, price, stock } = values;
    try {
      await updateProduct({
        variables: {
          input: {
            id,
            name,
            price,
            stock,
          },
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado correctamente',
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
  };

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-bold">Editar Producto</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={validationForm}
            enableReinitialize
            initialValues={getProduct}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form
                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                onSubmit={props.handleSubmit}
              >
                <InputForm
                  type="text"
                  name="name"
                  placeholder="Nombre de producto"
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  Nombre
                </InputForm>
                {props.errors.name && props.touched.name && (
                  <FormError error={props.errors.name} />
                )}

                <InputForm
                  type="number"
                  name="price"
                  placeholder="Precio de producto"
                  value={props.values.price}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  Precio
                </InputForm>
                {props.errors.price && props.touched.price && (
                  <FormError error={props.errors.price} />
                )}

                <InputForm
                  type="number"
                  name="stock"
                  placeholder="Cantidad de productos disponibles"
                  value={props.values.stock}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  Cantidad de Productos
                </InputForm>
                {props.errors.stock && props.touched.stock && (
                  <FormError error={props.errors.stock} />
                )}

                <ButtonInput value="Editar Producto" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
