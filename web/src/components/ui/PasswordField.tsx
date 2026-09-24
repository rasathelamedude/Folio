import { LuEye, LuEyeOff } from "react-icons/lu";
import { CiLock } from "react-icons/ci";

interface PasswordFieldProps {
  required?: boolean;
  name: string;
  label: string;
  isPasswordVisible: boolean;
  setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
  required,
  name,
  label,
  isPasswordVisible,
  setIsPasswordVisible,
  onChange,
  placeholder = "",
}: PasswordFieldProps) => {
  return (
    <>
      <label
        className="block text-xs font-medium text-foreground mb-1.5"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <CiLock className="text-foreground/75 font-bold text-md" />
        </div>
        <input
          id={name}
          required={required}
          onChange={onChange}
          name={name}
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-secondary text-foreground border border-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/60"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <LuEye className="text-foreground/75 font-bold text-md" />
          ) : (
            <LuEyeOff className="text-foreground/75 font-bold text-md" />
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordField;
