import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ButtonInput from 'components/ButtonInput';
import InputForm from 'components/InputForm';
import FormError from 'components/FormError';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const CREATE_CLIENT = gql`
  mutation createClient($input: ClientInput) {
    createClient(input: $input) {
      id
      name
      lastName
      email
      company
      phone
      sellerId
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

const NewClient = () => {
  const [createClient] = useMutation(CREATE_CLIENT, {
    update(cache, { data: { createClient } }) {
      // Read cache
      const { getClientsBySeller } = cache.readQuery({
        query: GET_CLIENTS_USER,
      });
      // Write cache
      cache.writeQuery({
        query: GET_CLIENTS_USER,
        data: {
          getClientsBySeller: [...getClientsBySeller, createClient],
        },
      });
    },
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      company: '',
      phone: '',
      email: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('El nombre es obligatorio'),
      lastName: yup.string().required('El apellido es obligatorio'),
      company: yup.string().required('El nombre de la empresa es obligatorio'),
      email: yup
        .string()
        .email('El formato del correo no es correcto')
        .required('El correo es obligatorio'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const { name, lastName, company, phone, email } = values;

      try {
        await createClient({
          variables: {
            input: {
              name,
              lastName,
              company,
              email,
              phone,
            },
          },
        });
        Swal.fire({
          icon: 'success',
          title: 'Cliente creado correctamnte',
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
    },
  });

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-bold">Nuevo Cliente</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <InputForm
              type="text"
              name="name"
              placeholder="Nombre del cliente"
              value={formik.values.name}
              onChange={formik.handleChange}
            >
              Nombre
            </InputForm>
            {formik.errors.name && formik.touched.name && (
              <FormError error={formik.errors.name} />
            )}
            <InputForm
              type="text"
              name="lastName"
              placeholder="Apellido del cliente"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            >
              Apellido
            </InputForm>
            {formik.errors.lastName && formik.touched.lastName && (
              <FormError error={formik.errors.lastName} />
            )}
            <InputForm
              type="text"
              name="company"
              placeholder="Empresa del cliente"
              value={formik.values.company}
              onChange={formik.handleChange}
            >
              Empresa
            </InputForm>
            {formik.errors.company && formik.touched.company && (
              <FormError error={formik.errors.company} />
            )}
            <InputForm
              type="tel"
              name="phone"
              placeholder="Teléfono del cliente"
              value={formik.values.phone}
              onChange={formik.handleChange}
            >
              Teléfono
            </InputForm>
            <InputForm
              type="email"
              name="email"
              placeholder="Tu Correo"
              value={formik.values.email}
              onChange={formik.handleChange}
            >
              Correo
            </InputForm>
            {formik.errors.email && formik.touched.email && (
              <FormError error={formik.errors.email} />
            )}

            <ButtonInput value="Crear Cliente" />
          </form>
        </div>
      </div>
    </>
  );
};

export default NewClient;
