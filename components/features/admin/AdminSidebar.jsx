'use client'

import { useEffect } from "react";

const NAV_ITEMS = [
  { id: "overview",     label: "ภาพรวม",        icon: "📊" },
  { id: "addTeam",      label: "เพิ่มทีมใหม่",   icon: "➕" },
  { id: "manageTeams",  label: "จัดการทีม",      icon: "⚙️" },
  { id: "images",       label: "จัดการรูปภาพ",   icon: "🖼️" },
  { id: "publish",      label: "อัพเดทข้อมูล",   icon: "📤" },
];

export default function AdminSidebar({ user, isOpen, onClose, activeSection, onSectionChange }) {
  // Sync body class so CSS can slide the sidebar on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("admin-sidebar-open");
    } else {
      document.body.classList.remove("admin-sidebar-open");
    }
    return () => {
      document.body.classList.remove("admin-sidebar-open");
    };
  }, [isOpen]);

  function handleNavClick(id) {
    onSectionChange?.(id);
    // Auto-close sidebar on small screens after navigation
    if (window.innerWidth < 768) {
      onClose?.();
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar${isOpen ? " admin-sidebar--open" : ""}`}>
        {/* Profile section */}
        <div className="admin-sidebar-profile">
          <div className="admin-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username || "Admin"}
                width={40}
                height={40}
              />
            ) : (
              <span>{(user?.username || "A").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="admin-sidebar-user">
            <strong>{user?.username || "Admin"}</strong>
            {user?.guild && <small>{user.guild}</small>}
          </div>
          <button
            className="admin-sidebar-close"
            onClick={onClose}
            type="button"
            aria-label="ปิด sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item${activeSection === item.id ? " active" : ""}`}
              onClick={() => handleNavClick(item.id)}
              type="button"
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="admin-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
