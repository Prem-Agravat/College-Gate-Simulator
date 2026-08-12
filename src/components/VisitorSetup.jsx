import { useState } from 'react'
import IDCard from './IDCard'

const DEFAULT = {
  name: 'Rahul Shah',
  purpose: 'Meet Professor',
  person: 'Prof. Patel',
  department: 'Computer Engineering',
  phone: '9876543210',
  type: 'parent',
  college: 'RK University',
}

export default function VisitorSetup({ onStart, onBack, college = 'RK University' }) {
  const [form, setForm] = useState({ ...DEFAULT, college })
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <section className="setup-screen" aria-labelledby="visitor-setup">
      <button type="button" className="text-back" onClick={onBack}>← Roles</button>
      <h1 id="visitor-setup">VISITOR DETAILS</h1>
      <p className="setup-sub">Security will ask. Be ready.</p>
      <div className="setup-layout">
        <form
          className="setup-form"
          onSubmit={(e) => {
            e.preventDefault()
            onStart(form)
          }}
        >
          <label>
            Name
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label>
            Purpose
            <input value={form.purpose} onChange={(e) => update('purpose', e.target.value)} required />
          </label>
          <label>
            Person to meet
            <input value={form.person} onChange={(e) => update('person', e.target.value)} required />
          </label>
          <label>
            Department
            <input value={form.department} onChange={(e) => update('department', e.target.value)} required />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </label>
          <button type="submit" className="primary-btn">GET VISITOR PASS →</button>
        </form>
        <article className="visitor-pass-preview">
          <IDCard
            name={form.name}
            college={form.college}
            course={`${form.purpose} · ${form.person}`}
            semester={form.department}
            studentId={form.phone}
            validYear="TODAY"
            variant="visitor"
          />
        </article>
      </div>
    </section>
  )
}
