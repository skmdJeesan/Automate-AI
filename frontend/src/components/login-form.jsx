import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { signInWithPopup } from "firebase/auth"
import { auth, google_provider } from "@/lib/firebase.js"
import { login } from "@/features/auth.js"
import { useDispatch } from "react-redux"
import { setUserData } from "@/redux/userSlice.js"
// import { Input } from "@/components/ui/input"

export function LoginForm() {
  const dispatch = useDispatch()

  const handle_google_login = async () => {
    try {
      const res = await signInWithPopup(auth, google_provider)
      const token = await res.user.getIdToken()
      const data = await login(token)
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className=''>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button onClick={handle_google_login}
                  variant="outline" type="button" className='cursor-pointer bg-black/80 hover:bg-black text-white/80 hover:text-white transition-colors duration-500'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
