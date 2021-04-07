const ButtonInput = ({ value }) => {
  return (
    <input
      type="submit"
      className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
      value={value}
    />
  );
};

export default ButtonInput;
