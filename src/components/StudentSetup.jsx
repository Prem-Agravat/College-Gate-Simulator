import { useRef, useState } from 'react'
import IDCard from './IDCard'
import { defaultStudentProfile } from '../data/students'

export default function StudentSetup({ onStart, onBack }) {
  const [form, setForm] = useState({ ...defaultStudentProfile })
  const fileRef = useRef(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const onPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('photo', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <section className="setup-screen" aria-labelledby="setup-title">
      <button type="button" className="text-back" onClick={onBack}>← Roles</button>
      <h1 id="setup-title">RK UNIVERSITY ID</h1>
      <p className="setup-sub">Fill your details once — then walk to the gate.</p>
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
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required autoComplete="name" />
          </label>

          <label>
            Course
            <input value={form.course} onChange={(e) => update('course', e.target.value)} required />
          </label>
          <label>
            Semester
            <input value={form.semester} onChange={(e) => update('semester', e.target.value)} required />
          </label>
          <label>
            Student ID
            <input value={form.studentId} onChange={(e) => update('studentId', e.target.value)} required />
          </label>
          <label>
            Photo
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} />
          </label>
          <button type="submit" className="primary-btn">ENTER GATE →</button>
        </form>
        <IDCard {...form} />
      </div>
    </section>
  )
}
