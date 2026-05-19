'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Contribute', path: '/contribute' },
    { label: 'New Pool', path: '/create' },
    { label: 'Roommates', path: '/roommates' },
    { label: 'History', path: '/history' },
  ]

  const [profile, setProfile] = useState<any>(null)
  const [roommates, setRoommates] = useState<any[]>([])

useEffect(() => {
  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

   if (data) {
  setProfile(data)

  const { data: roommateData } = await supabase
    .from('profiles')
    .select('*')
    .eq('room', String(data.room))

  if (roommateData) {
    setRoommates(roommateData)
  }
}
  }

  fetchProfile()
}, [])

  async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/login')
}

  return (
    <div style={{ width: '220px', background: '#0B1215', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100vh' }}>
      <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '24px', paddingLeft: '8px' }}>
        Nex<span style={{ color: '#00897B' }}>Pool</span>
      </div>

      {navItems.map((item) => (
        <div key={item.label}
          onClick={() => router.push(item.path)}
          className={pathname !== item.path ? 'nav-hover' : ''}
          style={{
            padding: '10px 14px', borderRadius: '8px',
            color: pathname === item.path ? '#fff' : 'rgba(255,255,255,0.5)',
            background: pathname === item.path ? '#00897B' : 'transparent',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
          }}>
          {item.label}
        </div>
      ))}

      <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your room</div>
      <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
  {profile?.room || 'No room'}
</div>

<div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>
  {profile?.hostel || 'No hostel'}
</div>
       
        <div style={{ marginTop: '12px', display: 'flex' }}>
          {roommates.map((member: any, i: number) => (
  <div
    key={i}
    title={member.name}
    style={{  width: '26px',  height: '26px',  borderRadius: '50%',  background: ['#00897B', '#1565C0', '#F59E0B', '#9C27B0', '#E64A19'][i % 5],  color: '#fff',  fontSize: '9px',  fontWeight: '700',  display: 'flex',  alignItems: 'center',  justifyContent: 'center',  border: '2px solid #0B1215',  marginLeft: i === 0 ? '0' : '-6px',
    }}
  >
    {member.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()}
  </div>
))}
            
        </div>
      </div>

      <div onClick={handleLogout} className="nav-hover"
        style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', color: '#FF6B6B',  background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'center', }}>  Logout
      </div>
    </div>
  )
}