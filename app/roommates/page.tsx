
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import { supabase } from '../../lib/supabase'

export default function Roommates() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)
  const [roommates, setRoommates] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const filtered = roommates.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    async function fetchRoommates() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // current user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profileData) return

  setProfile(profileData)

  // fetch roommates from same room
  const { data: roommatesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('room', String(profileData.room))

  if (roommatesData) {
  console.log(roommatesData)
  setRoommates([...roommatesData])
}

  // fetch invites only for same room
  const { data: inviteData } = await supabase
    .from('invitations')
    .select('*')
    .eq('room', profileData.room)

  if (inviteData) {
    setInvites(inviteData)
  }
}

    fetchRoommates()
  }, [])

  async function sendInvite() {
  if (!inviteEmail) return

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
  .from('invitations')
  .insert([
    {
      email: inviteEmail,
      invited_by: user.id,
      room: profile?.room || '',
      hostel: profile?.hostel || '',
    },
  ])

  if (!error) {
    setInviteSent(true)

    setTimeout(() => {
      setInviteSent(false)
      setInviteEmail('')
      setShowInvite(false)
    }, 2000)
  }
}

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, padding: '28px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700' }}>
              Roommates
            </h1>

            <p style={{
              color: '#7A8F97',
              fontSize: '14px',
              marginTop: '4px'
            }}>
              {profile?.room || 'No room'} · {roommates.length} members
            </p>
          </div>

          <button
            onClick={() => setShowInvite(true)}
            style={{
              padding: '10px 18px',
              background: '#00897B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Invite roommate
          </button>
        </div>

        {/* Invite modal */}
        {showInvite && (
          <div style={{
            background: '#fff',
            border: '1px solid #E2E8EB',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontWeight: '700',
              fontSize: '15px',
              marginBottom: '4px'
            }}>
              Invite a roommate
            </div>

            <div style={{
              fontSize: '13px',
              color: '#7A8F97',
              marginBottom: '16px'
            }}>
              They'll get an email to join your room's pools.
            </div>

            {inviteSent ? (
              <div style={{
                background: '#E0F2F1',
                border: '1px solid #00897B',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#00695C',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                ✓ Invite sent to {inviteEmail}!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder=" "
                  type="email"
                  style={{
                    flex: 1,
                    padding: '10px 13px',
                    border: '1.5px solid #E2E8EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />

                <button
                  onClick={sendInvite}
                  style={{
                    padding: '10px 20px',
                    background: '#00897B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Send invite
                </button>

                <button
                  onClick={() => setShowInvite(false)}
                  style={{
                    padding: '10px 16px',
                    background: '#F4F7F8',
                    color: '#7A8F97',
                    border: '1px solid #E2E8EB',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search roommates..."
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '10px 13px',
              border: '1.5px solid #E2E8EB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
              background: '#fff'
            }}
          />
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total members', value: roommates.length },
            { label: 'All paid up', value: '0' },
            { label: 'Have pending dues', value: '0' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: '#fff',
                border: '1px solid #E2E8EB',
                borderRadius: '12px',
                padding: '16px 18px'
              }}
            >
              <div style={{
                fontSize: '12px',
                color: '#7A8F97',
                marginBottom: '6px'
              }}>
                {s.label}
              </div>

              <div style={{
                fontSize: '22px',
                fontWeight: '700'
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
        
        {invites.length > 0 && (
  <div style={{
    background: '#FFF8E1',
    border: '1px solid #F59E0B',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '20px'
  }}>
    <div style={{
      fontWeight: '700',
      marginBottom: '10px',
      color: '#92400E'
    }}>
      Pending Invitations
    </div>

    {invites.map((invite, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0',
          borderBottom: i < invites.length - 1 ? '1px solid #FCD34D' : 'none'
        }}
      >
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>
            {invite.email}
          </div>

          <div style={{
            fontSize: '12px',
            color: '#A16207'
          }}>
            {invite.room} · {invite.hostel}
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#D97706'
        }}>
          PENDING
        </div>
      </div>
    ))}
  </div>
)}

        {/* Roommate cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px'
        }}>
          {filtered.map((r, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #E2E8EB',
                borderRadius: '16px',
                padding: '20px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#E0F2F1',
                  color: '#00695C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {r.name?.slice(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '700',
                    fontSize: '15px'
                  }}>
                    {r.name}
                  </div>

                  <div style={{
                    fontSize: '12px',
                    color: '#7A8F97',
                    marginTop: '2px'
                  }}>
                    {r.room}
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: '#E0F2F1',
                  color: '#00695C',
                }}>
                  All paid
                </span>
              </div>

              {/* Progress */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#7A8F97',
                marginBottom: '6px'
              }}>
                <span>Pools paid</span>

                <span style={{
                  fontWeight: '600',
                  color: '#0B1215'
                }}>
                  0 / 0
                </span>
              </div>

              <div style={{
                height: '5px',
                background: '#F4F7F8',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{
                  height: '100%',
                  width: `0%`,
                  background: '#00897B',
                  borderRadius: '3px'
                }} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '11px',
                    color: '#7A8F97'
                  }}>
                    Total contributed
                  </div>

                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#00695C',
                    fontFamily: 'monospace'
                  }}>
                    ₹0
                  </div>
                </div>

                <button style={{
                  padding: '7px 14px',
                  background: '#F4F7F8',
                  border: '1px solid #E2E8EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#3D4F56',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  Send reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

