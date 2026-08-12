import React from 'react'

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="role-switcher-container">
      <span className="role-switcher-label">MODE</span>
      <div className="role-switcher-buttons">
        <button
          onClick={() => onRoleChange('student')}
          className={`role-btn student-btn ${currentRole === 'student' ? 'active' : ''}`}
          aria-label="Switch to Student Mode"
        >
          <span className="role-icon">👨‍🎓</span>
          <span className="role-text">STUDENT</span>
        </button>
        <button
          onClick={() => onRoleChange('checker')}
          className={`role-btn checker-btn ${currentRole === 'checker' ? 'active' : ''}`}
          aria-label="Switch to ID Checker Mode"
        >
          <span className="role-icon">🛂</span>
          <span className="role-text">ID CHECKER</span>
        </button>
      </div>
    </div>
  )
}
