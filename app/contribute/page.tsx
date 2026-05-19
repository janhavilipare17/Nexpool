'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function ContributePage() {
  const router = useRouter()
  const [pools, setPools] = useState<any[]>([])

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

const { data } = await supabase
  .from('pools')
  .select('*')
  .eq('room', profile?.room)
      if (data) setPools(data)
    }

    fetchPools()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: '28px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Contribute to Pools
        </h1>

        <p style={{
          color: '#7A8F97',
          marginBottom: '28px',
          fontSize: '15px'
        }}>
          Choose a hostel fee pool to contribute
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {pools.map((pool) => {
            const pct = Math.round(
              (((pool.collected || 0) / pool.goal) * 100)
            )

            return (
              <div
                key={pool.id}
                onClick={() => router.push(`/pools/${pool.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #E2E8EB',
                  borderRadius: '18px',
                  padding: '18px',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '4px'
                    }}>
                      {pool.name}
                    </h2>

                    <div style={{
                      fontSize: '13px',
                      color: '#7A8F97'
                    }}>
                      Room {pool.room}
                    </div>
                  </div>

                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: '#E0F2F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    🍽️
                  </div>
                </div>

                <div style={{
                  height: '8px',
                  background: '#F4F7F8',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: '#00897B'
                  }} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#7A8F97',
                      marginBottom: '2px'
                    }}>
                      Collected
                    </div>

                    <div style={{
                      fontWeight: '700',
                      color: '#00695C'
                    }}>
                      ₹{(pool.collected || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#7A8F97',
                      marginBottom: '2px',
                      textAlign: 'right'
                    }}>
                      Goal
                    </div>

                    <div style={{
                      fontWeight: '700'
                    }}>
                      ₹{pool.goal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}