import { Input } from "./ui/input";

export default function FiltersYearInput() {
  return (
    <Input type="number" placeholder="Year" step="1" min="2000" max="2050" />
  );
}
