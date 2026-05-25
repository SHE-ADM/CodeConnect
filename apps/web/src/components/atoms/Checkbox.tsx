type CheckboxProps = {
  id: string
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}

export function Checkbox({ id, checked, onChange, label }: Readonly<CheckboxProps>) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="w-5 h-5 rounded-sm border-2 border-ink-muted bg-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-page flex items-center justify-center transition-colors shrink-0">
        {checked && (
          <svg
            className="w-3 h-3 text-brand"
            viewBox="0 0 10 8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm text-ink-muted">{label}</span>
    </label>
  )
}
