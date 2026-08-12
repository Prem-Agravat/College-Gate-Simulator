export default function NoticeBoard({ notice }) {
  return (
    <aside className="notice-board" aria-label="College notice board">
      <h2>NOTICE</h2>
      <p>{notice}</p>
    </aside>
  )
}
