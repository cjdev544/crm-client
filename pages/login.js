import { useFormik } from 'formik';
import Link from 'next/link';

const { default: ButtonInput } = require('components/ButtonInput');
const { default: InputForm } = require('components/InputForm');

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log('Enviando...');
      console.log(values);
    },
  });

  return (
    <>
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
            >
              Correo
            </InputForm>
            <InputForm
              type="password"
              name="password"
              placeholder="Tu Contraseña"
              value={formik.values.password}
              onChange={formik.handleChange}
            >
              Contraseña
            </InputForm>
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
