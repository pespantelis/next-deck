"use client"

import { useId } from "react"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface InputFieldControlProps<TFieldValues extends FieldValues>
  extends Omit<
    React.ComponentProps<"input">,
    "aria-invalid" | "name" | "value" | "onChange" | "onBlur" | "ref"
  > {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label: string
  description?: string
}

export function InputFieldControl<TFieldValues extends FieldValues>({
  id,
  name,
  control,
  label,
  description,
  disabled,
  readOnly,
  ...inputProps
}: InputFieldControlProps<TFieldValues>) {
  const inputId = useId()
  const fieldId = id ?? `field-${name}-${inputId}`

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <Input
            id={fieldId}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            readOnly={readOnly}
            {...field}
            {...inputProps}
            className="read-only:pointer-events-none read-only:cursor-not-allowed read-only:opacity-50"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  )
}
