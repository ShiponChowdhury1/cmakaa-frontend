import { useState } from "react";

const toggleStyle = `
  .toggle-label { position: relative; display: inline-block; width: 51px; height: 31px; cursor: pointer; flex-shrink: 0; }
  .toggle-label input { opacity: 0; width: 0; height: 0; }
  .toggle-track { position: absolute; inset: 0; border-radius: 100px; background: #e5e5ea; transition: background 0.2s; }
  .toggle-label input:checked + .toggle-track { background: #1a1a1a; }
  .toggle-thumb { position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; border-radius: 50%; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: transform 0.2s; pointer-events: none; }
  .toggle-label input:checked ~ .toggle-thumb { transform: translateX(20px); }
`;

interface ToggleProps {
  defaultChecked: boolean;
}

function Toggle({ defaultChecked }: ToggleProps) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle-label">
      <input type="checkbox" checked={on} onChange={() => setOn(!on)} />
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </label>
  );
}

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleLogout = () => {
    // Add actual logout logic here
    console.log("Logging out...");
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords don't match");
      return;
    }
    console.log("Password changed");
    setShowChangePasswordModal(false);
  };

  return (
    <>
      <style>{toggleStyle}</style>
      <div className="min-h-screen bg-gray-100 w-full">
        <div className="w-full  mx-auto px-4 py-6 space-y-4 pb-24">

          <div className="flex gap-4">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl p-6 w-full shadow-sm">
            {/* Title */}
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Profile
            </div>

            {/* Avatar Row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg font-bold shrink-0">
                MJ
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">Marcus Johnson</div>
                <div className="text-sm font-medium mt-0.5" style={{ color: "#E05A1E" }}>marcus_j@PardnaBook</div>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Full Name</label>
              <div className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900">Marcus Johnson</div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Username</label>
              <div className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 flex justify-between items-center">
                <span>marcus_j</span>
                <span className="text-gray-400 text-sm">@PardnaBook</span>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Phone Number</label>
              <div className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900">+44 7700 900000</div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
              <div className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900">marcus@example.com</div>
            </div>
          </div>

          {/* NOTIFICATION CARD */}
          <div className="bg-white rounded-2xl p-6 w-full shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Notification Preferences
            </div>

            {[
              { title: "Due soon reminders", sub: "Alert when contributions are due within 48 hours", on: true },
              { title: "Overdue alerts", sub: "Alert when a participant misses a deadline", on: true },
              { title: "Payout ready", sub: "Alert when a payout is ready to confirm", on: true },
              { title: "Weekly digest", sub: "Summary of all pardna activity each week", on: false },
            ].map((n, i, arr) => (
              <div
                key={n.title}
                className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex-1 pr-4">
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{n.title}</div>
                  <div className="text-xs text-blue-500">{n.sub}</div>
                </div>
                <Toggle defaultChecked={n.on} />
              </div>
            ))}
            </div>
          </div>

          {/* SECURITY CARD */}
          <div className="bg-white rounded-2xl p-6 w-full shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Security
            </div>

            {/* Top Row - Help & guide and Change Password */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Help & guide */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Help &amp; guide</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              {/* Change Password */}
              <div onClick={() => setShowChangePasswordModal(true)} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Change Password</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>

            {/* Log out button */}
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-semibold mb-3 cursor-pointer transition-opacity hover:opacity-90 border-none" style={{ background: "#E8294A" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </button>

            {/* Reset demo data */}
            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer bg-transparent border-none hover:opacity-75 transition-opacity" style={{ color: "#E05A1E" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E05A1E" strokeWidth="2.2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              Reset demo data
            </button>

            <div className="text-xs text-gray-400 mt-4">Account created: 15 Jan 2025</div>
          </div>

        </div>

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
              {/* Close button */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Log out of PardnaBook?</h2>

              {/* Description */}
              <p className="text-gray-500 mb-8 leading-relaxed">
                You'll need to sign in again to access your dashboard and pardnas.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-lg text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: "#E8294A" }}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
              {/* Close button */}
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Title */}
              <div className="flex items-center gap-3 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8294A" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              </div>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  placeholder="password123"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400"
                />
              </div>

              {/* New Password and Confirm Row */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">New Password</label>
                  <input
                    type="password"
                    placeholder="newpassword"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="newpassword"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={handlePasswordChange}
                className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: "#E05A1E" }}
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}