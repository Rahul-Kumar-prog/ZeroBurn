import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Small inline AWS badge ────────────────────────────────────────────────────
function AwsBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <svg viewBox="0 0 40 24" className="h-5 w-8" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="700"
          fontFamily="Arial, sans-serif">aws</text>
        <path d="M8 20 Q20 26 32 20" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M29 18 L33 21 L29 23" stroke="#FF9900" strokeWidth="2" fill="none"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

type ConnectionStatus = "idle" | "checking" | "connected" | "not_found"

// ── Status banner ─────────────────────────────────────────────────────────────
function StatusBanner({ status, accountId }: { status: ConnectionStatus; accountId: string }) {
  if (!accountId.trim() || status === "idle") {
    return (
      <div className="flex items-center rounded-lg bg-[#1e1e24] px-4 py-3">
        <span className="text-sm text-[#6b6b7b]">
          Enter your AWS Account ID above to check connection status
        </span>
      </div>
    )
  }
  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#1e1e24] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-sm text-[#9a9aaa]">Checking connection status…</span>
      </div>
    )
  }
  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#1e1e24] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-sm text-green-400">Account connected successfully</span>
      </div>
    )
  }
  // not_found — role missing, user needs to grant permissions
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#1e1e24] px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-orange-400" />
      <span className="text-sm text-[#9a9aaa]">
        Permissions not found — click Grant permissions to set up access
      </span>
    </div>
  )
}

// ── AwsSetup page ─────────────────────────────────────────────────────────────
export default function AwsSetup() {
  const navigate = useNavigate()
  const [accountId, setAccountId] = useState("")
  const [cfnUrl, setCfnUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingInitial, setIsCheckingInitial] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle")
  const [grantedOnce, setGrantedOnce] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── On every valid 12-digit account ID, do a single status check ─────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }

    if (accountId.length !== 12) {
      setConnectionStatus("idle")
      setCfnUrl(null)
      setGrantedOnce(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsCheckingInitial(true)
      setConnectionStatus("checking")
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/aws/status?account_id=${accountId}`
        )
        const data = await res.json()
        setConnectionStatus(data.status === "connected" ? "connected" : "not_found")
      } catch {
        setConnectionStatus("not_found")
      } finally {
        setIsCheckingInitial(false)
      }
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [accountId])

  // ── Once user has opened the CFN URL, start polling every 10s ────────────
  useEffect(() => {
    if (!grantedOnce || connectionStatus === "connected") return

    const poll = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/aws/status?account_id=${accountId}`
        )
        const data = await res.json()
        if (data.status === "connected") {
          setConnectionStatus("connected")
          if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
        }
      } catch { /* network hiccup — keep polling */ }
    }

    poll()
    pollRef.current = setInterval(poll, 10_000)
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantedOnce])

  const handleGrantPermissions = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (accountId.length !== 12) return

    // Re-open cached URL if we already fetched it
    if (cfnUrl) {
      window.open(cfnUrl, "_blank", "noopener,noreferrer")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/aws/connect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account_id: accountId }),
        }
      )
      const text = await response.text()
      const data = text ? JSON.parse(text) : {}

      if (!response.ok) throw new Error(data.error ?? "Failed to generate CloudFormation URL")
      if (!data.cfn_url) throw new Error("No CloudFormation URL returned from server")

      setCfnUrl(data.cfn_url)
      setGrantedOnce(true)
      window.open(data.cfn_url, "_blank", "noopener,noreferrer")
    } catch (err) {
      if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
        setError("Cannot reach the server — make sure the backend is running on port 8003")
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const alreadyConnected = connectionStatus === "connected"
  // Show the Grant button only while not yet connected and initial check is done
  const showGrantButton = accountId.length === 12 && !isCheckingInitial && !alreadyConnected

  // Status banner message changes once the user has opened the CFN URL
  const bannerStatus: ConnectionStatus =
    connectionStatus === "not_found" && grantedOnce ? "checking" : connectionStatus

  return (
    <div className="flex min-h-screen flex-col bg-[#0e0e10]">

      {/* ── Main content ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-2xl border border-[#2a2a30] bg-[#18181c] p-8">

          {/* Header row */}
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-[#8a8a9a] hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-[#2a2a30]">|</span>
            <div className="flex items-center gap-2">
              <AwsBadge />
              <span className="text-sm font-semibold text-white">Grant AWS permissions</span>
            </div>
          </div>

          {/* Pre-step note */}
          <p className="mb-6 text-sm text-[#9a9aaa]">
            Before proceeding,{" "}
            <a
              href="https://console.aws.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white underline underline-offset-2 hover:text-gray-300"
            >
              login to the AWS Console
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>

          {/* ── Step 1: Account ID ── */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-white">AWS Account ID</p>
            <Input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="123456789012"
              maxLength={12}
              className="h-11 w-72 rounded-lg border-[#2e2e35] bg-[#0e0e10] text-white placeholder:text-[#4a4a55] focus-visible:ring-1 focus-visible:ring-[#4752c4]"
            />
          </div>

          {/* ── Step 2: CloudFormation ── */}
          <div className="mb-6">
            <p className="mb-1 text-sm font-semibold text-white">
              Create an AWS CloudFormation stack
            </p>
            <p className="mb-4 text-xs text-[#6b6b7b]">
              This gives Zeroburn permissions to create the necessary roles and policies to manage
              the infrastructure in your account.
            </p>

            {/* Grant permissions button — hidden once connected */}
            {showGrantButton && (
              <a
                href={cfnUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGrantPermissions}
                className={cn(
                  "mb-3 inline-flex items-center gap-2 rounded-lg border border-[#2e2e35] bg-[#1e1e24] px-4 py-2.5 text-sm text-[#9a9aaa] transition-colors",
                  !isLoading
                    ? "hover:border-[#4752c4] hover:text-white cursor-pointer"
                    : "opacity-60 cursor-not-allowed pointer-events-none"
                )}
              >
                <AwsBadge />
                {isLoading ? "Opening…" : "Grant permissions"}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

            {/* Connection status banner */}
            <StatusBanner status={bannerStatus} accountId={accountId} />
          </div>

          {/* ── Step 3: Complete setup ── */}
          <div className="mb-2">
            <p className="mb-1 text-sm font-semibold text-white">Complete setup</p>
            <p className="mb-4 text-xs text-[#6b6b7b]">
              Wait for Zeroburn to create roles and policies to access your account. This can take
              up to 10 minutes.
            </p>
            <div className="flex items-center rounded-lg bg-[#1e1e24] px-4 py-3">
              {alreadyConnected ? (
                <span className="text-sm text-green-400">Account connected — ready to continue</span>
              ) : (
                <span className="text-sm text-[#6b6b7b]">Waiting for account to be connected</span>
              )}
            </div>
          </div>

          {/* Continue */}
          <div className="mt-8 flex justify-end">
            <Button
              disabled={!alreadyConnected}
              onClick={() => alreadyConnected && navigate("/dashboard")}
              className={cn(
                "h-10 rounded-lg px-6 text-sm font-medium transition-colors",
                alreadyConnected
                  ? "bg-[#4752c4] text-white hover:bg-[#3c45a5] cursor-pointer"
                  : "bg-[#2e2e35] text-[#8a8a9a] cursor-not-allowed opacity-50"
              )}
            >
              Continue
            </Button>
          </div>

        </div>
      </div>

      {/* ── Footer step bar ── */}
      <div className="flex items-center justify-between border-t border-[#1e1e24] px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#8a8a9a]">Step 3 of 5</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("h-1 rounded-full", i < 3 ? "w-8 bg-white" : "w-8 bg-[#2e2e35]")} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-sm text-[#8a8a9a] hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Talk to support
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#8a8a9a] hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Account settings
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}
