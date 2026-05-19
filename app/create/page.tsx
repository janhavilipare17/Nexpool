'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import { supabase } from '../../lib/supabase'
const poolTypes = [
  { name: 'Mess fees', icon: '🍽️', desc: 'Monthly food contribution' },
  { name: 'Room deposit', icon: '🔑', desc: 'Security or advance payment' },
  { name: 'Farewell', icon: '🎉', desc: 'Party or gift fund' },
  { name: 'Equipment', icon: '📺', desc: 'Common room purchases' },
]

export default function CreatePool() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('Mess fees')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [deadline, setDeadline] = useState('')
  const [room, setRoom] = useState('')
  const [note, setNote] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [memberInput, setMemberInput] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [creatorUpi, setCreatorUpi] = useState('')
  function addMember() {
    if (!memberInput.trim()) return
    setMembers([...members, memberInput.trim()])
    setMemberInput('')
  }

  function removeMember(i: number) {
    setMembers(members.filter((_, idx) => idx !== i))
  }

  async function handleCreate() {
  if (!name || !goal) {
    alert('Please enter a pool name and goal amount.')
    return
  }
  setLoading(true)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
  alert("User not logged in")
  setLoading(false)
  return
}
  const { data, error } = await supabase.from('pools').insert({
    name,
    type: selectedType,
    goal: parseInt(goal),
    deadline,
    room,
    creator_upi: creatorUpi,
    note,
    created_by: user?.id,
  }).select().single()

  if (error) {
    alert('Error creating pool: ' + error.message)
    setLoading(false)
    return
  }

  setSuccess(true)
  setLoading(false)
  setTimeout(() => router.push('/dashboard'), 2500)
}

  const initials = (n: string) => n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, padding: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Create a new pool</h1>
        <p style={{ color: '#7A8F97', fontSize: '14px', marginBottom: '24px' }}>Set up a shared fund for your room or floor</p>

        {success && (
          <div style={{ background: '#E0F2F1', border: '1px solid #00897B', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', color: '#00695C', fontWeight: '600', fontSize: '14px' }}>
            ✓ Pool created! Redirecting to dashboard...
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

          {/* Form */}
          <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', padding: '24px' }}>

            {/* Basic details */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Basic details</div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Pool name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mess Fees — July"
                  style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Goal amount (₹)</label>
                  <input value={goal} onChange={e => setGoal(e.target.value)} type="number" placeholder="10000"
                    style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Deadline</label>
                  <input value={deadline} onChange={e => setDeadline(e.target.value)} type="date"
                    style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Room / Block</label>
                <input value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. Room 214, B Block"
                  style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              <div style={{ marginTop: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}> Creator UPI ID</label>
                <input value={creatorUpi}  onChange={e => setCreatorUpi(e.target.value)} placeholder=" "
                   style={{ width: '100%',  padding: '10px 13px',  border: '1.5px solid #E2E8EB',  borderRadius: '8px',  fontSize: '14px',  outline: 'none',  fontFamily: 'inherit' }} />
              </div>
            </div>

            {/* Pool type */}
            <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8EB' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Pool type</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {poolTypes.map(t => (
                  <div key={t.name} onClick={() => setSelectedType(t.name)} style={{
                    padding: '14px', borderRadius: '12px', cursor: 'pointer',
                    border: selectedType === t.name ? '1.5px solid #00897B' : '1.5px solid #E2E8EB',
                    background: selectedType === t.name ? '#E0F2F1' : '#fff',
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{t.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: selectedType === t.name ? '#00695C' : '#7A8F97', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Members */}
            <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8EB' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Add roommates</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input value={memberInput} onChange={e => setMemberInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  placeholder="Name or roll number"
                  style={{ flex: 1, padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={addMember} style={{ padding: '10px 16px', background: '#E0F2F1', border: '1.5px solid #B2DFDB', borderRadius: '8px', color: '#00695C', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {members.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: '#F4F7F8', border: '1px solid #E2E8EB', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E0F2F1', color: '#00695C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700' }}>{initials(m)}</div>
                    {m}
                    <span onClick={() => removeMember(i)} style={{ cursor: 'pointer', color: '#B0BEC5', marginLeft: '2px' }}>×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ paddingTop: '20px', borderTop: '1px solid #E2E8EB' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Note for roommates</div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="e.g. Please pay before the 5th. Excess will roll over to next month."
                style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', minHeight: '80px', resize: 'none' }} />
            </div>

            <button onClick={handleCreate} style={{
  width: '100%', marginTop: '20px', padding: '14px',
  background: loading ? '#7A8F97' : '#00897B',
  color: '#fff', border: 'none', borderRadius: '12px',
  fontSize: '15px', fontWeight: '700',
  cursor: loading ? 'not-allowed' : 'pointer'
}}>
  {loading ? 'Creating...' : 'Create pool & notify roommates'}
</button>
          </div>

          {/* Live preview */}
          <div style={{ background: '#fff', border: '1px solid #E2E8EB', borderRadius: '16px', padding: '22px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#7A8F97', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>Live preview</div>
            <div style={{ background: '#00897B', borderRadius: '12px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '32px' }}>{poolTypes.find(t => t.name === selectedType)?.icon}</span>
            </div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{name || 'Pool name here'}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', display: 'inline-block', background: '#E0F2F1', color: '#00695C', marginBottom: '14px' }}>{selectedType}</div>
            {[
              { label: 'Goal', value: goal ? `₹${parseInt(goal).toLocaleString('en-IN')}` : '—' },
              { label: 'Deadline', value: deadline || '—' },
              { label: 'Room', value: room || '—' },
              { label: 'Members', value: members.length.toString() },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8EB', fontSize: '13px' }}>
                <span style={{ color: '#7A8F97' }}>{row.label}</span>
                <span style={{ fontWeight: '600' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
              {members.map((m, i) => (
                <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E0F2F1', color: '#00695C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>{initials(m)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}