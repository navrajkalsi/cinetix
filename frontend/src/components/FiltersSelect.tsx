import type { Format } from "@/models/Format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { cn } from "cn";

interface Props {
  formats: Format[];
}

export default function FiltersSelect({ formats }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Select
      id="format-select"
      itemToStringLabel={(f: Format) => f.name}
      itemToStringValue={(f: Format) => f.id.toString()}
      isItemEqualToValue={(i, v) => i.id === v.id}
      highlightItemOnHover
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger
        className={cn("w-full", open && "border-ring ring-2 ring-primary/20")}
      >
        <SelectValue placeholder="Format" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {formats.map((format) => (
            <SelectItem key={format.id} value={format}>
              {format.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
