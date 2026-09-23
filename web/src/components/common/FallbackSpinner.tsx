import { ImSpinner } from "react-icons/im";

const FallbackSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ImSpinner className="animate-spin text-3xl text-[#2A6B56]" />
    </div>
  );
};

export default FallbackSpinner;
