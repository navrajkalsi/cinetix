import Input from "../../components/Input";

export default function BookingNew() {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }
  return (
    <Input name="ID" type="text" required={true} onChange={handleChange} />
  );
}
