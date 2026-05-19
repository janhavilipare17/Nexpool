'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [room, setRoom] = useState('')
  const [hostel, setHostel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
  setError('')
  if (!email || !password) { setError('Please fill in all fields.'); return }
  if (mode === 'signup' && !name) { setError('Please enter your name.'); return }
  setLoading(true)

  if (mode === 'signup') {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    // Save profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        room,
        hostel,
      })
    }
    setLoading(false)
    router.push('/dashboard')

  } else {
    const { error: signInError } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (signInError) {
  setError(signInError.message)
  setLoading(false)
  return
}

const { data: sessionData } = await supabase.auth.getSession()
console.log(sessionData)

const user = sessionData.session?.user

if (user) {
  const { data: invites } = await supabase
    .from('invitations')
    .select('*')
    .eq('email', user.email)
    .eq('status', 'pending')

  console.log(invites)
  if (invites && invites.length > 0) {
    await supabase
  .from('invitations')
  .update({ status: 'accepted' })
  .eq('id', invites[0].id)
  alert(`You were invited to join ${invites[0].room}`)
}
}
    setLoading(false)
    router.push('/dashboard')
  }
}

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>

      {/* Left — branding panel */}
      <div style={{
        background: '#0B1215',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
      }}>
        <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>
          Hostel<span style={{ color: '#00897B' }}>Pool</span>
        </div>

        <div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#fff', lineHeight: '1.2', marginBottom: '16px' }}>
            Pool money.<br />
            Skip the chaos.<br />
            <span style={{ color: '#00897B' }}>Stay friends.</span>
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
            The easiest way for hostel roommates to collect and manage shared expenses  mess fees, deposits, farewells and more.
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: '🏠', text: 'Room-wise pool tracking' },
            { icon: '⚡', text: 'Instant UPI payments' },
            { icon: '📊', text: 'See who has paid and who hasn\'t' },
            { icon: '🔒', text: 'Secured by Razorpay escrow' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,137,123,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{
        background: '#F4F7F8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#E2E8EB', borderRadius: '10px', padding: '4px', marginBottom: '28px' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '9px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: mode === m ? '#fff' : 'transparent',
                fontWeight: '600', fontSize: '14px',
                color: mode === m ? '#0B1215' : '#7A8F97',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </div>
          <div style={{ fontSize: '14px', color: '#7A8F97', marginBottom: '24px' }}>
            {mode === 'login' ? 'Log in to manage your hostel pools.' : 'Join HostelPool and manage shared expenses easily.'}
          </div>

          {error && (
            <div style={{ background: '#FFF0EB', border: '1px solid #FF6B35', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#FF6B35', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Kumar"
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }} />
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@college.edu"
                style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
                style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }} />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Hostel name</label>
                  <input value={hostel} onChange={e => setHostel(e.target.value)} placeholder="e.g. VIT Hostel Block B"
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#3D4F56', display: 'block', marginBottom: '6px' }}>Room number</label>
                  <input value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. Room 214"
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E2E8EB', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }} />
                </div>
              </>
            )}

            <button onClick={handleSubmit} style={{
              width: '100%', padding: '13px', background: loading ? '#7A8F97' : '#00897B',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginTop: '4px',
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in →' : 'Create account →'}
            </button>

          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#7A8F97' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{ color: '#00897B', fontWeight: '600', cursor: 'pointer' }}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}