const FormError = ({ error }) => {
  return (
    <div className="mt-2 bg-red-200 border-l-4 border-red-500 text-red-700 p-2">
      <p>
        <span className="font-bold">Error: </span>
        {error}
      </p>
    </div>
  );
};

export default FormError;
