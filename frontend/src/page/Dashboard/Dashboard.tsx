import { cn } from "@/lib/utils"

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string
  value: string
  sub: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <div className="rounded-xl border border-[#2a2a30] bg-[#18181c] px-5 py-4">
      <p className="mb-1 text-xs text-[#6b6b7b]">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p
        className={cn(
          "mt-1 text-xs",
          trend === "down" ? "text-green-400" :
          trend === "up"   ? "text-red-400"   : "text-[#6b6b7b]"
        )}
      >
        {sub}
      </p>
    </div>
  )
}

// ── Spark-bar chart (CSS only) ────────────────────────────────────────────────
const mockBars = [42, 58, 51, 67, 73, 65, 80, 70, 88, 76, 92, 84]
const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function SpendChart() {
  const max = Math.max(...mockBars)
  return (
    <div className="rounded-xl border border-[#2a2a30] bg-[#18181c] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Monthly Spend</p>
        <span className="rounded-full bg-[#1e1e24] px-2.5 py-0.5 text-xs text-[#6b6b7b]">Last 12 months</span>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {mockBars.map((val, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-[#4752c4] opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${(val / max) * 100}%` }}
              title={`$${(val * 120).toLocaleString()}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {months.map((m) => (
          <span key={m} className="flex-1 text-center text-[9px] text-[#4a4a55]">{m}</span>
        ))}
      </div>
    </div>
  )
}

// ── Top services table ────────────────────────────────────────────────────────
const services = [
  { name: "EC2 Instances",      cost: "$4,210",  change: "+3%",  trend: "up"      },
  { name: "RDS",                cost: "$1,840",  change: "-8%",  trend: "down"    },
  { name: "S3",                 cost: "$620",    change: "0%",   trend: "neutral" },
  { name: "Lambda",             cost: "$310",    change: "-12%", trend: "down"    },
  { name: "Data Transfer",      cost: "$290",    change: "+1%",  trend: "up"      },
]

function TopServices() {
  return (
    <div className="rounded-xl border border-[#2a2a30] bg-[#18181c] p-5">
      <p className="mb-4 text-sm font-semibold text-white">Top Services by Cost</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[#4a4a55]">
            <th className="pb-2 font-medium">Service</th>
            <th className="pb-2 font-medium text-right">This month</th>
            <th className="pb-2 font-medium text-right">vs last month</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e24]">
          {services.map((s) => (
            <tr key={s.name}>
              <td className="py-2.5 text-[#c0c0cc]">{s.name}</td>
              <td className="py-2.5 text-right font-medium text-white">{s.cost}</td>
              <td
                className={cn(
                  "py-2.5 text-right text-xs",
                  s.trend === "down"    ? "text-green-400" :
                  s.trend === "up"      ? "text-red-400"   : "text-[#6b6b7b]"
                )}
              >
                {s.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Connected accounts strip ──────────────────────────────────────────────────
function AccountsStrip() {
  return (
    <div className="rounded-xl border border-[#2a2a30] bg-[#18181c] p-5">
      <p className="mb-3 text-sm font-semibold text-white">Connected Accounts</p>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e0e10]">
          <svg viewBox="0 0 40 24" className="h-4 w-7" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">aws</text>
            <path d="M8 20 Q20 26 32 20" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M29 18 L33 21 L29 23" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white">Amazon Web Services</p>
          <p className="text-[10px] text-[#6b6b7b]">Read-only · ZeroburnReadOnlyRole</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Connected
        </span>
      </div>
    </div>
  )
}

// ── Dashboard page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="mt-0.5 text-sm text-[#6b6b7b]">Your cloud cost overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total spend this month"  value="$7,270"  sub="↑ $420 vs last month"  trend="up"      />
        <StatCard label="Projected end-of-month"  value="$9,100"  sub="Based on current usage" trend="neutral" />
        <StatCard label="Potential savings"        value="$1,340"  sub="From recommendations"   trend="down"    />
        <StatCard label="Active resources"         value="142"     sub="Across all accounts"     trend="neutral" />
      </div>

      {/* Chart + accounts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendChart />
        </div>
        <AccountsStrip />
      </div>

      {/* Top services */}
      <TopServices />

    </div>
  )
}
