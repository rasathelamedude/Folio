import { ImSpinner } from "react-icons/im";

const FallbackSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <ImSpinner className="animate-spin text-3xl text-primary" />
    </div>
  );
};

export default FallbackSpinner;
