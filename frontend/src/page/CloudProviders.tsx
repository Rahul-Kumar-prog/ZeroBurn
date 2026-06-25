import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── AWS Logo ──────────────────────────────────────────────────────────────────
function AwsLogo() {
  return (
    <svg viewBox="0 0 120 60" className="w-28 h-14" xmlns="http://www.w3.org/2000/svg">
      {/* "aws" lowercase */}
      <text
        x="60" y="36"
        textAnchor="middle"
        fill="white"
        fontSize="36"
        fontWeight="700"
        fontFamily="'Amazon Ember', Arial, sans-serif"
        letterSpacing="-1"
      >
        aws
      </text>
      {/* Orange smile arrow */}
      <path
        d="M30 48 Q60 62 90 48"
        stroke="#FF9900"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M86 44 L92 49 L85 52"
        stroke="#FF9900"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── GCP Logo ──────────────────────────────────────────────────────────────────
function GcpLogo() {
  return (
    <svg viewBox="0 0 80 64" className="w-16 h-14" xmlns="http://www.w3.org/2000/svg">
      {/* Back cloud — blue */}
      <ellipse cx="52" cy="36" rx="22" ry="18" fill="#4285F4" />
      <rect x="30" y="36" width="44" height="18" fill="#4285F4" rx="2" />
      {/* Front cloud — multi-color segments */}
      {/* Red arc top-left */}
      <path d="M18 32 Q10 20 24 14 Q34 8 42 16" fill="#EA4335" />
      {/* Yellow arc bottom-left */}
      <path d="M10 42 Q6 30 18 32 L18 50 Q10 50 10 42z" fill="#FBBC05" />
      {/* Green bottom */}
      <path d="M18 50 Q18 56 28 56 L48 56 Q54 56 54 50 L18 50z" fill="#34A853" />
      {/* Blue right */}
      <path d="M42 16 Q56 10 60 24 Q64 36 54 44 Q54 50 48 50 L18 50 L18 32 Q24 20 42 16z" fill="#4285F4" />
      {/* White cloud hole to give it the cloud shape */}
      <ellipse cx="36" cy="44" rx="6" ry="5" fill="#1a1a1f" />
    </svg>
  )
}

// ── Azure Logo ────────────────────────────────────────────────────────────────
function AzureLogo() {
  return (
    <svg viewBox="0 0 56 64" className="w-12 h-14" xmlns="http://www.w3.org/2000/svg">
      {/* Azure "A" shape — two shades of blue like the real logo */}
      <path
        d="M28 4 L52 56 L36 56 L28 38 L20 56 L4 56 Z"
        fill="url(#azureGrad)"
      />
      {/* Inner cutout to form the "A" letter shape */}
      <path
        d="M28 18 L38 48 L28 42 L18 48 Z"
        fill="#1a1a1f"
      />
      <defs>
        <linearGradient id="azureGrad" x1="4" y1="4" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#50E6FF" />
          <stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Provider data ─────────────────────────────────────────────────────────────
const providers = [
  { id: "aws",   name: "Amazon Web Services",  logo: <AwsLogo />,  available: true  },
  { id: "gcp",   name: "Google Cloud Platform", logo: <GcpLogo />,  available: false },
  { id: "azure", name: "Microsoft Azure",        logo: <AzureLogo />, available: false },
]

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  provider: typeof providers[0]
  selected: boolean
  onSelect: () => void
}

function ProviderCard({ provider, selected, onSelect }: CardProps) {
  return (
    <button
      onClick={() => onSelect()}
      className={cn(
        // size — matches the wide rectangular card in the screenshot
        "relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-150",
        "w-[220px] h-[180px]",
        // border & bg
        selected
          ? "border-2 border-white bg-[#2a2a2e]"
          : "border border-[#2e2e35] bg-[#1a1a1f] hover:border-[#4a4a55] hover:bg-[#202026]",
        provider.available ? "cursor-pointer" : "cursor-pointer opacity-60"
      )}
    >
      {/* Logo — centered in the upper area */}
      <div className="flex flex-1 items-center justify-center">
        {provider.logo}
      </div>

      {/* Name — bottom-left, bold white when selected, muted otherwise */}
      <p className={cn(
        "text-left text-sm font-semibold leading-snug mt-3",
        selected ? "text-white" : "text-[#8a8a9a]"
      )}>
        {provider.name}
      </p>
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CloudProviders() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string>("aws")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e10] px-6 py-12">

      <div className="w-full max-w-3xl">

        {/* Section label */}
        <p className="mb-5 text-sm text-[#8a8a9a]">
          Choose your existing cloud provider
        </p>

        {/* Cards row */}
        <div className="flex flex-wrap gap-4">
          {providers.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              selected={selected === p.id}
              onSelect={() => setSelected(p.id)}
            />
          ))}
        </div>

        {/* Continue */}
        <div className="mt-10 flex flex-col gap-3">
          <Button
            
            onClick={() => {
              navigate(`/setup/${selected}`)
              console.log(selected);
              console.log(`/setup/${selected}`);
            }}
            className="h-11 w-full rounded-lg bg-[#4752c4] text-sm font-semibold text-white hover:bg-[#3c45a5]"
          >
            Connect {providers.find((p) => p.id === selected)?.name}
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#6b6b7b] hover:text-white transition-colors text-center"
          >
            ← Go back
          </button>
        </div>

      </div>
    </div>
  )
}
