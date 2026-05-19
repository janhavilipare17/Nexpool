'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Sidebar from '../../components/Sidebar'

export default function PoolDetail() {
  const router = useRouter()
  const params = useParams()
  const [method, setMethod] = useState('UPI')
  
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  

const [pool, setPool] = useState<any>(null)
const [contributions, setContributions] = useState<any[]>([])
const [memberCount, setMemberCount] = useState(1)


useEffect(() => {
  async function fetchPool() {
    const { data } = await supabase
      .from('pools')
      .select('*')
      .eq('id', params.id)
      .single()
      if (data) setPool(data)
      if (data?.room) {
    const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .eq('room', data.room)

  if (members) {
    setMemberCount(members.length)
  }
}

      const { data: contributionData } = await supabase
  .from('contributions')
  .select('*')
  .eq('pool_id', params.id)

if (contributionData) setContributions(contributionData)
  }

  fetchPool()
}, [])

if (!pool) {
  return <div style={{ padding: '40px' }}>Loading...</div>
}
const pct = Math.round(((pool.collected || 0) / pool.goal) * 100)

  async function handlePay() {
  setPaying(true)

const res = await fetch('/api/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: Math.max(
      1,
      Math.ceil(pool.goal / Math.max(memberCount, 1))
    ),
  }),
})

const order = await res.json()

const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  name:  'NexPool',
  description: pool.name,
  order_id: order.id,
  modal: {
  ondismiss: function () {
    setPaying(false)
  }
},

  handler: async function () {
    setPaying(false)
    setPaid(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const amount = Math.max(
      1,
      Math.ceil(pool.goal / Math.max(memberCount, 1))
    )

    if (user) {
      await supabase.from('contributions').insert({
        pool_id: pool.id,
        user_id: user.id,
        name: user.email,
        amount,
        status: 'paid',
        paid_at: new Date(),
      })

      await supabase
        .from('pools')
        .update({
          collected: (pool.collected || 0) + amount,
        })
        .eq('id', pool.id)

      setPool({
        ...pool,
        collected: (pool.collected || 0) + amount,
      })

      setContributions([
        ...contributions,
        {
          name: user.email,
          amount,
          paid_at: new Date(),
        },
      ])
    }
  },

  theme: {
    color: '#00897B',
  },
}

const razor = new (window as any).Razorpay(options)
razor.open()
}

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, padding: '28px' }}>

        {/* Back */}
        <div onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A8F97', cursor: 'pointer', marginBottom: '20px', fontWeight: '500' }}>
          ← Back to dashboard
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700' }}>{pool.name}</h1>
            <p style={{ color: '#7A8F97', fontSize: '14px', marginTop: '4px' }}>{pool.room} · {pool.type} Pool</p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: '#E0F2F1', color: '#00695C' }}>{pool.type}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* Left — pool info + contributors */}
          <div>
            {/* Pool banner + progress */}
            <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ background: '#00897B', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '48px' }}>🍽️</span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ height: '8px', background: '#F4F7F8', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#00897B', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7A8F97' }}>
                  <span><strong style={{ color: '#00695C' }}>₹{(pool.collected || 0).toLocaleString('en-IN')}</strong> collected</span>
                  <span>Goal: ₹{pool.goal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#FF6B35', fontWeight: '500' }}>
                  Due {pool.deadline}
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#7A8F97', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>Who's paid</div>
              {contributions.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < contributions.length - 1 ? '1px solid #E2E8EB' : 'none' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0F2F1', color: '#00695C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{c.name?.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>
                      {c.name}
                      {c.you && <span style={{ fontSize: '10px', background: '#E0F2F1', color: '#00695C', padding: '2px 7px', borderRadius: '10px', fontWeight: '700', marginLeft: '6px' }}>You</span>}
                      {!c.paid && <span style={{ fontSize: '10px', background: '#FFF0EB', color: '#FF6B35', padding: '2px 7px', borderRadius: '10px', fontWeight: '700', marginLeft: '6px' }}>Pending</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: '#B0BEC5', marginTop: '2px' }}>{new Date(c.paid_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#00695C', fontFamily: 'monospace' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — pay panel */}
          <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', padding: '22px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Your contribution</div>
            <div style={{ fontSize: '12px', color: '#7A8F97', marginBottom: '20px' }}>Your share of the mess fees</div>

            <div style={{ background: '#F4F7F8', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A8F97', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Amount due</div>
              <div style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'monospace' }}>₹{Math.ceil(pool.goal / Math.max(memberCount, 1)).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '11px', color: '#7A8F97', marginTop: '4px' }}>{pool.name}</div>
            </div>

            {/* Payment method */}
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', marginBottom: '8px' }}>Pay via</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {['UPI', 'Card', 'Net Banking'].map(m => (
                <div key={m} onClick={() => setMethod(m)} style={{
                  padding: '10px 6px', border: method === m ? '1.5px solid #00897B' : '1.5px solid #E2E8EB',
                  borderRadius: '8px', background: method === m ? '#E0F2F1' : '#fff',
                  cursor: 'pointer', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                    {m === 'UPI' ? '⚡' : m === 'Card' ? '💳' : '🏦'}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: method === m ? '#00695C' : '#7A8F97' }}>{m}</div>
                </div>
              ))}
            </div>

           

            <button onClick={handlePay} disabled={paying || paid} style={{
              width: '100%', padding: '14px',
              background: paid ? '#065F46' : '#00897B',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}>
              {paid ? '✓ Payment successful!' : paying ? 'Processing...' : ` Pay ₹${Math.max(1, Math.ceil(pool.goal / Math.max(memberCount, 1))).toLocaleString('en-IN')}via ${method}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#B0BEC5', marginTop: '10px' }}>
              🔒 Secured by Razorpay · 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}