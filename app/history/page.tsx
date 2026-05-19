'use client'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import { supabase } from '../../lib/supabase'


const typeColors: Record<string, { bg: string, color: string }> = {
  Mess: { bg: '#E0F2F1', color: '#00695C' },
  Deposit: { bg: '#EFF6FF', color: '#1E40AF' },
  Farewell: { bg: '#FEF3C7', color: '#92400E' },
  Equipment: { bg: '#FDF2F8', color: '#831843' },
}

export default function History() {
  const router = useRouter()
  
  const [search, setSearch] = useState('')
  const [transactions, setTransactions] = useState<any[]>([])
  useEffect(() => {
  async function fetchTransactions() {
    const { data } = await supabase
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setTransactions(data)
  }

  fetchTransactions()
}, [])
  

  const filtered = transactions.filter(t =>
  t.name.toLowerCase().includes(search.toLowerCase()) ||
  t.pool.toLowerCase().includes(search.toLowerCase())
)

  const totalPaid = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, padding: '28px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Transaction history</h1>
          <p style={{ color: '#7A8F97', fontSize: '14px', marginTop: '4px' }}>All payments across your pools</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total collected', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: '#00897B' },
            { label: 'Pending amount', value: `₹${totalPending.toLocaleString('en-IN')}`, color: '#FF6B35' },
            { label: 'Transactions', value: transactions.length.toString(), color: '#2563EB' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontSize: '12px', color: '#7A8F97', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '700' }}>{s.value}</div>
              <div style={{ width: '24px', height: '3px', background: s.color, borderRadius: '2px', marginTop: '8px' }} />
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or pool..."
            style={{ padding: '9px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: '#fff', width: '240px' }} />
        </div>

        {/* Transactions table */}
        <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '12px 20px', background: '#F4F7F8', borderBottom: '1px solid #E2E8EB' }}>
            {['Member', 'Pool', 'Type', 'Amount', 'Status'].map(h => (
              <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#7A8F97', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7A8F97', fontSize: '14px' }}>No transactions found.</div>
          ) : (
            filtered.map((t, i) => (
              <div key={t.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #E2E8EB' : 'none',
                alignItems: 'center',
              }}>
                {/* Member */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.color, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{t.initials}</div>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.name}</span>
                </div>

                {/* Pool */}
                <div style={{ fontSize: '13px', color: '#7A8F97' }}>{t.pool}</div>

                {/* Type */}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: typeColors[t.type]?.bg, color: typeColors[t.type]?.color }}>
                    {t.type}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: t.status === 'paid' ? '#00695C' : '#FF6B35' }}>
                  ₹{t.amount.toLocaleString('en-IN')}
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px',
                    background: t.status === 'paid' ? '#E0F2F1' : '#FFF0EB',
                    color: t.status === 'paid' ? '#00695C' : '#FF6B35',
                  }}>
                    {t.status === 'paid' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}