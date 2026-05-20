import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'

type FormFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  required?: boolean
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  )
}
