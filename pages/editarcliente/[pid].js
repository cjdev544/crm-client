import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';

import InputForm from 'components/InputForm';
import FormError from 'components/FormError';
import ButtonInput from 'components/ButtonInput';

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
      id
      company
      email
      lastName
      name
      phone
    }
  }
`;
const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
      id
      company
      email
      lastName
      name
      phone
    }
  }
`;

const UpdateClient = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // Get data client
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id,
    },
  });

  // Update client
  const [updateClient] = useMutation(UPDATE_CLIENT);

  if (loading) return <p>Cargando...</p>;
  if (error) {
    router.replace('/');
    return <p>Datos del cliente no encontrados</p>;
  }
  const { getClient } = data;

  const schemaValidator = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    lastName: yup.string().required('El apellido es obligatorio'),
    company: yup.string().required('El nombre de la empresa es obligatorio'),
    email: yup
      .string()
      .email('El formato del correo no es correcto')
      .required('El correo es obligatorio'),
  });

  // Submit form
  const handleSubmit = async (values) => {
    const { name, lastName, company, email, phone } = values;
    try {
      await updateClient({
        variables: {
          id,
          input: {
            name,
            lastName,
            company,
            phone,
            email,
          },
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado correctamente',
        showConfirmButton: false,
        timer: 2000,
      });
      router.push('/');
    } catch (err) {
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
      <h1 className="text-2xl text-gray-800 font-bold">Editar Cliente</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidator}
            enableReinitialize
            initialValues={getClient}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <form
                  className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <InputForm
                    type="text"
                    name="name"
                    placeholder="Nombre del cliente"
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
                    type="text"
                    name="lastName"
                    placeholder="Apellido del cliente"
                    value={props.values.lastName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    Apellido
                  </InputForm>
                  {props.errors.lastName && props.touched.lastName && (
                    <FormError error={props.errors.lastName} />
                  )}
                  <InputForm
                    type="text"
                    name="company"
                    placeholder="Empresa del cliente"
                    value={props.values.company}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    Empresa
                  </InputForm>
                  {props.errors.company && props.touched.company && (
                    <FormError error={props.errors.company} />
                  )}
                  <InputForm
                    type="tel"
                    name="phone"
                    placeholder="Teléfono del cliente"
                    value={props.values.phone || ''}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    Teléfono
                  </InputForm>
                  <InputForm
                    type="email"
                    name="email"
                    placeholder="Tu Correo"
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    Correo
                  </InputForm>
                  {props.errors.email && props.touched.email && (
                    <FormError error={props.errors.email} />
                  )}

                  <ButtonInput value="Editar Cliente" />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateClient;
