import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface SubmitButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "disabled"> {
  isLoading: boolean
}

export function SubmitButton({
  children,
  isLoading,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <Button type={type} disabled={isLoading} {...props}>
      {isLoading && <Spinner />}
      {children}
    </Button>
  )
}
