const bg = "./../../public/bg.svg";

export default function Backdrop() {
  return (
    <div
      aria-hidden
      style={{ backgroundImage: `url(${bg})` }}
      className="fixed size-full -z-50 opacity-75 pointer-events-none bg-cover bg-center"
    />
  );
}
