interface InputProps {
  name: string;
  type: "datetime-local" | "number" | "text";
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ name, type, required, onChange }: InputProps) {
  return (
    <input name={name} type={type} required={required} onChange={onChange} />
  );
}
