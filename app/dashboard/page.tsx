'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import { supabase } from '../../lib/supabase'

type Pool = {
  id: number
  name: string
  type: string
  room: string
  collected: number
  goal: number
}

export default function Dashboard() {
  const router = useRouter()
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPools() {
      const {
  data: { user },
} = await supabase.auth.getUser()

if (!user) return

const { data: profile } = await supabase
  .from('profiles')
  .select('room')
  .eq('id', user.id)
  .single()

const { data, error } = await supabase
  .from('pools')
  .select('*')
  .eq('room', profile?.room)
  .order('created_at', { ascending: false })

      if (!error && data) setPools(data)
      setLoading(false)
    }
    fetchPools()
  }, [])
  const hour = new Date().getHours()

let greeting = 'Good morning ☀️'

if (hour >= 12 && hour < 17) {
  greeting = 'Good afternoon 🌤️'
} else if (hour >= 17) {
  greeting = 'Good evening 🌙'
}
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="page-enter" style={{ flex: 1, padding: "28px" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>{greeting}</h1>
          <p style={{ color: "#7A8F97", fontSize: "14px", marginTop: "4px" }}>Here's what's happening with your pools today.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Total pools", value: pools.length.toString(), sub: "Active" },
            { label: "Total goal", value: `₹${pools.reduce((s, p) => s + p.goal, 0).toLocaleString('en-IN')}`, sub: "Combined" },
           { label: "Total collected", value: `₹${pools.reduce((s, p) => s + (p.collected || 0), 0).toLocaleString('en-IN')}`, sub: "So far" },
          ].map((stat, idx) => (
            <div key={stat.label} className={`card-hover fade-in fade-in-${idx + 1}`} style={{
              background: "#fff", border: "1px solid #E2E8EB", borderRadius: "12px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "12px", color: "#7A8F97", marginBottom: "6px" }}>{stat.label}</div>
              <div className="stat-pop" style={{ fontSize: "22px", fontWeight: "700" }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "#00897B", marginTop: "4px" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Active pools</div>

        {loading ? (
          <div style={{ color: "#7A8F97", fontSize: "14px" }}>Loading pools...</div>
        ) : pools.length === 0 ? (
          <div style={{ background: "#fff", border: "1.5px dashed #B0BEC5", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🏊</div>
            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>No pools yet</div>
            <div style={{ color: "#7A8F97", fontSize: "14px", marginBottom: "16px" }}>Create your first pool to get started</div>
            <button onClick={() => router.push('/create')} style={{ padding: "10px 24px", background: "#00897B", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
              Create a pool
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {pools.map((pool, idx) => {
              const pct = Math.round((pool.collected / pool.goal) * 100)
              return (
                <div key={pool.id} onClick={() => router.push(`/pools/${pool.id}`)}
                  className={`card-hover fade-in fade-in-${idx + 4}`}
                  style={{ background: "#fff", border: "1px solid #E2E8EB", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>{pool.name}</div>
                      <div style={{ fontSize: "12px", color: "#7A8F97", marginTop: "2px" }}>{pool.room}</div>
                    </div>
                    <span style={{
                      fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
                      background: pool.type === "Mess fees" ? "#E0F2F1" : pool.type === "Room deposit" ? "#EFF6FF" : "#FEF3C7",
                      color: pool.type === "Mess fees" ? "#00695C" : pool.type === "Room deposit" ? "#1E40AF" : "#92400E",
                    }}>{pool.type}</span>
                  </div>
                  <div style={{ height: "6px", background: "#F4F7F8", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                    <div className="progress-animate" style={{
                      height: "100%", "--target-width": `${pct}%`,
                      background: pct < 50 ? "#F59E0B" : "#00897B", borderRadius: "3px",
                    } as React.CSSProperties} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ fontWeight: "600", color: "#00695C" }}>
                      ₹{(pool.collected || 0).toLocaleString("en-IN")}
                      <span style={{ color: "#7A8F97", fontWeight: "400" }}> / ₹{pool.goal.toLocaleString("en-IN")}</span>
                    </span>
                  </div>
                </div>
              )
            })}

            <div onClick={() => router.push('/create')} className="card-hover" style={{
              background: "#F4F7F8", border: "1.5px dashed #B0BEC5", borderRadius: "16px", padding: "20px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "8px", cursor: "pointer", minHeight: "140px",
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E0F2F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "#00897B" }}>+</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#7A8F97" }}>Create new pool</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}