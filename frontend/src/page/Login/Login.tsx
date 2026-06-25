import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// ── Google icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ── GitHub icon ───────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

// ── OR divider ────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[#2e2e35]" />
      <span className="text-xs tracking-widest text-[#6b6b7b] uppercase">or</span>
      <div className="h-px flex-1 bg-[#2e2e35]" />
    </div>
  )
}

// ── Login page ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e10] px-4">

      {/* Brand */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-[0.2em] text-white uppercase">
          Zeroburn
        </h1>
        <p className="mt-3 text-2xl font-semibold text-white">Log in</p>
      </div>

      {/* Card */}
      <Card className="w-full max-w-md border-[#2a2a30] bg-[#18181c] shadow-2xl">
        <CardContent className="flex flex-col gap-4 px-8 py-8">

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-lg border-[#2e2e35] bg-[#0e0e10] text-white placeholder:text-[#4a4a55] focus-visible:ring-1 focus-visible:ring-[#5865f2]"
            />
          </div>

          {/* Primary CTA */}
          <Button className="h-11 w-full cursor-pointer rounded-lg bg-[#4752c4] text-sm font-semibold text-white hover:bg-[#3c45a5] focus-visible:ring-[#5865f2]">
            Continue
          </Button>

          {/* OR */}
          <OrDivider />

          {/* Google */}
          <Button
            variant="outline"
            className="h-11 w-full cursor-pointer rounded-lg border-[#2e2e35] bg-transparent text-sm font-medium text-white hover:bg-[#222228] hover:text-white"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          {/* GitHub */}
          <Button
            variant="outline"
            className="h-11 w-full cursor-pointer rounded-lg border-[#2e2e35] bg-transparent text-sm font-medium text-white hover:bg-[#222228] hover:text-white"
          >
            <GitHubIcon />
            Continue with GitHub
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-[#6b6b7b] ">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold cursor-pointer text-white hover:underline"
            >
              Sign up
            </button>
          </p>

        </CardContent>
      </Card>
      <p className="mt-10 text-center text-sm text-[#6b6b7b] ">
        Continue without login?{" "}
        <Button
            onClick={() => navigate("/cloudproviders")}
            variant="outline"
            className="h-11 w-full mt-5 cursor-pointer rounded-lg border-[#2e2e35] bg-transparent text-sm font-medium text-white hover:bg-[#222228] hover:text-white"
          >
            Continue
          </Button>

      </p>

    </div>

  )
}
