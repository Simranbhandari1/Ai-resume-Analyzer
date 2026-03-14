import { Button } from "@/components/ui/button"

export default function SocialLogin() {
  return (
    <div className="flex gap-3">
      <Button variant="outline" className="w-full">
        LinkedIn
      </Button>

      <Button variant="outline" className="w-full">
        Google
      </Button>

      <Button variant="outline" className="w-full">
        Facebook
      </Button>
    </div>
  )
}