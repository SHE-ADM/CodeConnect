import type { InputHTMLAttributes } from 'react'
import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  id: string
  label: string
  onChange: (value: string) => void
  invalid?: boolean
  errorMessage?: string
}

export function FormField({
  id,
  label,
  onChange,
  invalid = false,
  errorMessage,
  ...props
}: Readonly<FormFieldProps>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        onChange={(e) => onChange(e.target.value)}
        invalid={invalid}
        aria-invalid={invalid || undefined}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        {...props}
      />
      {errorMessage && (
        <p id={`${id}-error`} className="text-xs text-red-400 mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
