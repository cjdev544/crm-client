import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';

import FormError from 'components/FormError';
import { useState } from 'react';
import { useRouter } from 'next/router';
const { default: ButtonInput } = require('components/ButtonInput');
const { default: InputForm } = require('components/InputForm');

const LOGIN_USER = gql`
  mutation loginUser($input: LoginInput) {
    loginUser(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const router = useRouter();

  const [loginUser] = useMutation(LOGIN_USER);

  const [message, setMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required('El correo es oligatorio')
        .email('El formato del correo no es valido'),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      try {
        const { data } = await loginUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        setMessage('Autenticando...');
        localStorage.setItem('crm-token', data.loginUser.token);
        setTimeout(() => {
          router.push('/');
        }, 2000);
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
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
            {formik.errors.email && formik.touched.email && (
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
            {formik.errors.password && formik.touched.password && (
              <FormError error={formik.errors.password} />
            )}
            <ButtonInput value="Iniciar sesión" />

            <p className="mt-3">
              ¿No tienes cuenta?
              <Link href="/registro">
                <a className="text-blue-700 underline ml-2">Crear Cuenta</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
