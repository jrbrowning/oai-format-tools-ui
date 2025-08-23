// File: components/TupleInputField.tsx

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  labelLeft: string;
  labelRight: string;
  step?: number;
  disabledRight?: boolean;
}

export function TupleInputField({
  name,
  labelLeft,
  labelRight,
  step,
  disabledRight,
}: Props) {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name={`${name}.0`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labelLeft}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step={step}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.1`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={disabledRight ? "text-muted-foreground" : ""}>
              {labelRight}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step={step}
                disabled={disabledRight}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
