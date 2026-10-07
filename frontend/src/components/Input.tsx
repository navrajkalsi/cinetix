interface InputProps {
  name: string;
  type: "datetime-local" | "number" | "text";
  required: boolean;
}

export default function Input({ name, type, required }: InputProps) {
  return <input name={name} type={type} required={required}></input>;
}
