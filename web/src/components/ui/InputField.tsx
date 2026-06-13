interface InputProps {
  type?: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string;
  icon?: React.ReactNode;
  label?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  icon,
  label,
  className,
  required,
}: InputProps) => {
  return (
    <div>
      <label
        className="block text-xs font-medium text-gray-700 mb-1.5"
        htmlFor={name}
      >
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {icon}
        </div>

        <input
          id={name}
          required={required}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
        />
      </div>
    </div>
  );
};

export default InputField;
