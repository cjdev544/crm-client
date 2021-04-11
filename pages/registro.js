import { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';

import ButtonInput from 'components/ButtonInput';
import InputForm from 'components/InputForm';
import FormError from 'components/FormError';

const REGISTER_USER = gql`
  mutation createUser($input: UserInput) {
    createUser(input: $input) {
      id
      name
      lastName
      email
      createAt
    }
  }
`;

const Register = () => {
  const [createUser] = useMutation(REGISTER_USER);

  const [message, setMessage] = useState(null);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      company: '',
      email: '',
      password: '',
      password2: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('El nombre es obligatorio'),
      lastName: yup.string().required('El apellido es obligatorio'),
      email: yup
        .string()
        .required('El correo es obligatorio')
        .email('El formato del correo no es valido'),
      password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener mínimo 6 caracteres'),
      password2: yup
        .string()
        .required('El campo es obligatorio')
        .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
    }),

    onSubmit: async (values) => {
      const { name, lastName, email, password } = values;

      try {
        await createUser({
          variables: {
            input: {
              name,
              lastName,
              email,
              password,
            },
          },
        });
        setMessage('Usuario creado correctamente. Seras redirigido al Login');
        setTimeout(() => {
          setMessage(null);
          router.push('/login');
        }, 3000);
      } catch (err) {
        setMessage(err.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  return (
    <>
      {message && (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          {message}
        </div>
      )}
      <h1 className="text-center text-2xl text-white font-light">
        Nueva Cuenta
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <InputForm
              type="text"
              name="name"
              placeholder="Tu Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Nombre
            </InputForm>
            {formik.touched.name && formik.errors.name && (
              <FormError error={formik.errors.name} />
            )}
            <InputForm
              type="text"
              name="lastName"
              placeholder="Tu Apellido"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Apellido
            </InputForm>
            {formik.touched.lastName && formik.errors.lastName && (
              <FormError error={formik.errors.lastName} />
            )}
            <InputForm
              type="email"
              name="email"
              placeholder="Tu Correo"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Correo
            </InputForm>
            {formik.touched.email && formik.errors.email && (
              <FormError error={formik.errors.email} />
            )}
            <InputForm
              type="password"
              name="password"
              placeholder="Tu Contraseña"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Contraseña
            </InputForm>
            {formik.touched.password && formik.errors.password && (
              <FormError error={formik.errors.password} />
            )}
            <InputForm
              type="password"
              name="password2"
              placeholder="Repite Contraseña"
              value={formik.values.password2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              Confirmar Contraseña
            </InputForm>
            {formik.touched.password2 && formik.errors.password2 && (
              <FormError error={formik.errors.password2} />
            )}

            <ButtonInput value="Crear Cuenta" />

            <p className="mt-3">
              ¿Ya tienes cuenta?
              <Link href="/login">
                <a className="text-blue-700 underline ml-2">Inicia Sesión</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
