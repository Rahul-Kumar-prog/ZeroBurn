import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Provider definitions ──────────────────────────────────────────────────────
const providers = [
  {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    description: "EC2, S3, RDS, Lambda and 200+ services",
    available: true,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FF9900" d="M13.527 21.529c0 .528.057 1.045.17 1.535.113.5.283.96.5 1.376.085.14.113.283.113.415 0 .18-.113.358-.34.537l-1.13.754a.855.855 0 01-.462.15c-.18 0-.358-.085-.528-.245a5.42 5.42 0 01-.631-.82 13.558 13.558 0 01-.547-1.045c-1.375 1.621-3.1 2.43-5.173 2.43-1.48 0-2.656-.424-3.525-1.27-.868-.848-1.31-1.978-1.31-3.393 0-1.5.528-2.713 1.593-3.619 1.064-.905 2.477-1.358 4.258-1.358.59 0 1.197.047 1.838.14.64.094 1.3.235 1.98.405v-1.254c0-1.301-.273-2.214-.81-2.742-.547-.528-1.47-.783-2.779-.783-.594 0-1.207.075-1.838.226a13.57 13.57 0 00-1.838.603 4.87 4.87 0 01-.594.226.994.994 0 01-.245.038c-.217 0-.32-.16-.32-.49v-.773c0-.254.028-.443.094-.556.066-.113.188-.226.386-.339a9.865 9.865 0 012.251-.81 10.84 10.84 0 012.77-.34c2.11 0 3.657.48 4.644 1.441.978.961 1.47 2.421 1.47 4.38v5.768zm-7.138 2.676c.575 0 1.17-.103 1.8-.31.631-.207 1.188-.584 1.65-1.112.282-.33.49-.697.594-1.121.103-.424.16-.94.16-1.545v-.745a14.56 14.56 0 00-1.593-.293 12.99 12.99 0 00-1.631-.103c-1.16 0-2.015.226-2.58.688-.566.462-.848 1.112-.848 1.96 0 .801.207 1.394.622 1.8.405.414.989.781 1.826.781zm13.916 1.875c-.283 0-.471-.047-.594-.15-.123-.094-.236-.311-.33-.603L16.73 14.78a2.73 2.73 0 01-.142-.622c0-.245.122-.377.367-.377h1.498c.292 0 .49.047.603.15.123.094.226.311.32.603l2.506 9.89 2.327-9.89c.085-.301.188-.51.31-.603.123-.103.33-.15.613-.15h1.216c.302 0 .5.047.622.15.122.094.235.311.31.603l2.356 10.012 2.581-10.012c.094-.301.207-.51.32-.603.122-.103.32-.15.603-.15h1.423c.245 0 .377.122.377.377 0 .075-.01.15-.028.235a2.29 2.29 0 01-.113.396l-3.62 11.547c-.094.301-.197.51-.32.603-.122.094-.32.15-.593.15h-1.31c-.301 0-.499-.047-.621-.15-.123-.103-.236-.311-.32-.612L24.1 16.666l-2.29 9.635c-.094.301-.197.509-.32.612-.122.103-.329.15-.62.15h-1.565zm19.304.415c-.792 0-1.584-.094-2.346-.283-.763-.188-1.357-.396-1.753-.631-.245-.14-.405-.292-.462-.434a1.097 1.097 0 01-.085-.415v-.8c0-.33.123-.49.358-.49.094 0 .188.018.283.056.094.038.236.094.387.16.527.235 1.102.42 1.705.547a9.22 9.22 0 001.828.188c.97 0 1.724-.17 2.252-.509.527-.34.8-.829.8-1.46 0-.433-.14-.791-.415-1.083-.283-.293-.81-.556-1.583-.8l-2.27-.707c-1.15-.358-2.005-.887-2.534-1.583a3.79 3.79 0 01-.79-2.318c0-.669.15-1.263.443-1.772a4.17 4.17 0 011.197-1.32 5.36 5.36 0 011.733-.82 7.3 7.3 0 011.998-.273c.35 0 .707.019 1.054.066.358.047.688.113 1.018.188.311.085.612.17.895.273.283.103.509.207.678.32.226.14.386.283.481.434.094.141.141.32.141.547v.744c0 .33-.122.5-.358.5-.123 0-.32-.065-.575-.188a6.915 6.915 0 00-2.883-.594c-.877 0-1.574.142-2.064.434-.49.292-.744.735-.744 1.357 0 .434.16.801.48 1.093.32.293.906.585 1.745.849l2.224.706c1.132.358 1.96.858 2.459 1.498.5.641.744 1.376.744 2.196 0 .678-.14 1.29-.414 1.828-.283.537-.668 1.017-1.16 1.404a5.26 5.26 0 01-1.78.895 7.498 7.498 0 01-2.253.32z"/>
        <path fill="#FF9900" d="M42.197 32.458c-5.04 3.724-12.36 5.7-18.656 5.7-8.825 0-16.776-3.262-22.786-8.686-.471-.424-.047-.999.519-.669 6.49 3.78 14.508 6.048 22.805 6.048 5.587 0 11.733-1.16 17.386-3.563.857-.367 1.565.565.732 1.17z"/>
        <path fill="#FF9900" d="M44.243 30.13c-.641-.82-4.24-.387-5.861-.197-.49.057-.566-.368-.123-.678 2.873-2.015 7.576-1.432 8.123-.754.547.687-.15 5.39-2.845 7.641-.414.348-.81.16-.622-.292.603-1.516 1.97-4.9 1.328-5.72z"/>
      </svg>
    ),
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    shortName: "Azure",
    description: "Virtual machines, AKS, Blob Storage and more",
    available: false,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <path fill="#0089D6" d="M22.379 4.846L10.008 26.025l6.372 9.533H4.5l8.063 8.596h30.937L22.379 4.846z"/>
        <path fill="#0089D6" d="M27.19 6.012L19.837 26.38l7.735 9.178-14.192 2.467 10.053 6.129 18.817-3.91L27.19 6.012z" opacity=".7"/>
      </svg>
    ),
  },
  {
    id: "gcp",
    name: "Google Cloud",
    shortName: "GCP",
    description: "Compute Engine, GKE, Cloud Storage and more",
    available: false,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M30.2 16.3h1.1l3.2-3.2.2-1.4C28.5 5.3 19.3 4.2 12.6 9.3c-1.9 1.5-3.4 3.4-4.4 5.6l1.2-.2 6.4-1 .5-.5c3.1-3.4 8.3-3.9 12-1z"/>
        <path fill="#4285F4" d="M37.8 14.9c-1.2-4.4-3.9-8.2-7.6-10.8l-5.5 5.5c1.9 1.5 3 3.8 2.9 6.2v.8c2.2 0 4.3.9 5.8 2.4s2.4 3.6 2.4 5.8c0 4.5-3.6 8.1-8.1 8.1H19.4l-.8.8v4.9l.8.7H27.7c5.9.1 11.3-3.3 13.8-8.6s1.8-11.6-1.7-16.1z"/>
        <path fill="#34A853" d="M11.1 38.1h8.3v-6.6h-8.3c-.6 0-1.2-.1-1.7-.4l-1.2.4-3.2 3.2-.3 1.2c1.7 1.4 3.9 2.2 6.4 2.2z"/>
        <path fill="#FBBC05" d="M11.1 16.2c-5.9.1-10.6 4.9-10.5 10.8.1 3.7 2 7.1 5.1 9.1l5.7-5.7c-2-.9-2.9-3.3-2-5.3.9-2 3.3-2.9 5.3-2 .9.4 1.6 1.1 2 2l5.7-5.7c-2.1-2.8-5.3-4.3-11.3-3.2z"/>
      </svg>
    ),
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    shortName: "DO",
    description: "Droplets, Kubernetes, Spaces and more",
    available: false,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#0080FF"/>
        <path fill="white" d="M24 10.3c-7.7 0-13.7 7-12.3 14.9 1 5.6 5.5 10.1 11.1 11.1 7.9 1.4 14.9-4.6 14.9-12.3H32c0 4.4-3.6 8-8 8-4.4 0-8-3.6-8-8s3.6-8 8-8v-5.7zm-8 19.4H12v-4.1h4.1v4.1zm-4.8-4.8H8v-3.4h3.3v3.4zm-3.8-4H4.1v-2.9H7.4v2.9z"/>
      </svg>
    ),
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    shortName: "CF",
    description: "Workers, R2, D1, Pages and more",
    available: false,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <path fill="#F6821F" d="M30.9 28.4c.1-.4.1-.8 0-1.1l.8-.5c.1 0 .1-.1 0-.2l-.7-1.3c0-.1-.1-.1-.2 0l-.9.4c-.3-.2-.6-.4-.9-.5l-.1-.9c0-.1-.1-.1-.2-.1h-1.5c-.1 0-.1.1-.2.1l-.1.9c-.3.1-.6.3-.9.5l-.9-.4c-.1 0-.2 0-.2 0l-.7 1.3c0 .1 0 .2 0 .2l.8.5c-.1.3-.1.7 0 1.1l-.8.5c-.1 0-.1.1 0 .2l.7 1.3c0 .1.1.1.2 0l.9-.4c.3.2.6.4.9.5l.1.9c0 .1.1.1.2.1h1.5c.1 0 .1-.1.2-.1l.1-.9c.3-.1.6-.3.9-.5l.9.4c.1 0 .2 0 .2 0l.7-1.3c0-.1 0-.2 0-.2l-.8-.5zm-2.4 1.3c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
        <path fill="#F6821F" d="M38.5 22.1c-.1-5.1-3.3-9.6-8.1-11.3-4.8-1.7-10.1-.2-13.3 3.8-1.2-.7-2.6-.9-4-.7-2.5.5-4.5 2.5-4.9 5-.1.6-.1 1.2 0 1.8C5.7 21.9 4 24 4 26.5 4 29.5 6.5 32 9.5 32h20c3.9 0 7-3.1 7-7 0-.3 0-.6-.1-.9 1.1-1 1.9-2.5 2.1-2zm-9.1 7.9H9.5C7.6 30 6 28.4 6 26.5c0-1.5 1-2.9 2.4-3.3l1.1-.3-.3-1.1c-.1-.5-.2-.9-.1-1.4.3-1.8 1.8-3.2 3.6-3.5 1.1-.2 2.3.1 3.2.8l1.2.9.8-1.2c2.6-3.8 7.5-5.1 11.7-3.1 3.7 1.7 6 5.5 5.8 9.5l-.1 1 1 .1c.1 0 .3.1.4.1 1.6.5 2.8 2 2.8 3.7 0 2.2-1.8 4-4 4z"/>
      </svg>
    ),
  },
  {
    id: "linode",
    name: "Akamai / Linode",
    shortName: "Linode",
    description: "Linodes, LKE, Object Storage and more",
    available: false,
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="#00B050"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">LN</text>
      </svg>
    ),
  },
]

// ── Provider card ─────────────────────────────────────────────────────────────
interface ProviderCardProps {
  provider: typeof providers[0]
  selected: boolean
  onSelect: () => void
}

function ProviderCard({ provider, selected, onSelect }: ProviderCardProps) {
  return (
    <button
      onClick={() => provider.available && onSelect()}
      disabled={!provider.available}
      className={cn(
        "group relative flex w-full flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-150",
        provider.available
          ? "cursor-pointer hover:border-[#4752c4] hover:bg-[#1e1e24]"
          : "cursor-not-allowed opacity-40",
        selected
          ? "border-[#4752c4] bg-[#1e1e24] ring-1 ring-[#4752c4]"
          : "border-[#2a2a30] bg-[#18181c]"
      )}
    >
      {/* Coming soon badge */}
      {!provider.available && (
        <span className="absolute right-3 top-3 rounded-full bg-[#2a2a30] px-2 py-0.5 text-[10px] font-medium text-[#6b6b7b]">
          Coming soon
        </span>
      )}

      {/* Selection indicator */}
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#4752c4]">
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0e0e10]">
          {provider.icon}
        </div>
        <div>
          <p className="font-semibold text-white">{provider.name}</p>
          <p className="text-xs text-[#6b6b7b] mt-0.5">{provider.shortName}</p>
        </div>
      </div>

      <p className="text-sm text-[#8a8a9a]">{provider.description}</p>
    </button>
  )
}

// ── CloudProviders page ───────────────────────────────────────────────────────
export default function CloudProviders() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e10] px-4 py-12">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-[0.2em] text-white uppercase">
          Zeroburn
        </h1>
        <p className="mt-4 text-2xl font-semibold text-white">Connect a Cloud Provider</p>
        <p className="mt-2 text-sm text-[#6b6b7b]">
          Select a provider to start analyzing your cloud costs
        </p>
      </div>

      {/* Grid */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            selected={selected === provider.id}
            onSelect={() => setSelected(provider.id)}
          />
        ))}
      </div>

      {/* Action */}
      <div className="mt-8 flex w-full max-w-2xl flex-col gap-3">
        <Button
          disabled={!selected}
          onClick={() => selected && navigate(`/setup/${selected}`)}
          className="h-11 w-full cursor-pointer rounded-lg bg-[#4752c4] text-sm font-semibold text-white hover:bg-[#3c45a5] disabled:opacity-40"
        >
          {selected
            ? `Connect ${providers.find((p) => p.id === selected)?.shortName}`
            : "Select a provider to continue"}
        </Button>

        <button
          onClick={() => navigate(-1)}
          className="text-center cursor-pointer text-sm text-[#6b6b7b] hover:text-white transition-colors"
        >
          ← Go back
        </button>
      </div>

    </div>
  )
}
