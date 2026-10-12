import type { InputHTMLAttributes } from "react";
import "./Input.css";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <label
      className={
        props.className ? props.className + " input-label" : "input-label"
      }
    >
      {props.placeholder}:
      <input
        {...props}
        autoComplete="off"
        className="input"
        onFocus={handleFocus}
      />
    </label>
  );
}
