import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Eye, EyeOff, Globe, Lock, User } from 'lucide-react';

const gradientStyle = {
  background: 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)',
};

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative shrink-0 cursor-pointer border-none p-0 focus:outline-none"
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: checked
          ? 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)'
          : '#D1D5DB',
        transition: 'background 0.3s ease',
      }}
      aria-checked={checked}
      role="switch"
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s ease',
        }}
      />
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ${className}`}
      style={{ border: '1px solid #F0F0F0' }}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span style={{ fontSize: '18px', color: '#FF9C65' }}>{icon}</span>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F5F5F5' }}>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}

function InputField({ label, type = 'text', defaultValue, placeholder }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#E57432] uppercase tracking-wider">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm text-gray-800 focus:outline-none bg-[#FFF8F2]"
        style={{
          border: '1.5px solid #FFD2B1',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = '#E57432')}
        onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
      />
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

function PasswordField({ label, value, showPassword, onToggleShowPassword }: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#E57432] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          defaultValue={value}
          className="w-full px-3 py-2.5 pr-11 rounded-lg text-sm text-gray-800 focus:outline-none bg-[#FFF8F2]"
          style={{
            border: '1.5px solid #FFD2B1',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#E57432')}
          onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E57432] hover:text-[#FF9C65] transition-colors"
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function GradientButton({ children, onClick, className = '' }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer border-none ${className}`}
      style={{ ...gradientStyle, transition: 'opacity 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [kycAlerts, setKycAlerts] = useState(true);
  const [exceptionAlerts, setExceptionAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [dualApproval, setDualApproval] = useState(false);
  const [autoProofPacks, setAutoProofPacks] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => {
      if (profilePhoto?.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhoto);
      }
    };
  }, [profilePhoto]);

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextPhoto = URL.createObjectURL(file);
    setProfilePhoto((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return nextPhoto;
    });
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: '#F7F8FA',}}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#E57432' }}>
            Settings
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure system preferences and security</p>
        </div>
       
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto space-y-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Admin Profile */}
          <Card className="h-full">
            <div className="p-6 h-full flex flex-col">
              <SectionHeader icon={<User size={18} />} title="Admin Profile" />
              <div className="flex flex-col sm:flex-row gap-5 mb-5">
                <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#E57432]/30 bg-[#FFF4EC] flex items-center justify-center shadow-sm">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Admin profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center px-3">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-[10px] font-semibold text-[#E57432] leading-tight">Upload</p>
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer border-none" style={gradientStyle}>
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  <InputField label="Full Name" defaultValue="Shipon Chowdhury" />
                  <InputField label="Email Address" type="email" defaultValue="shipon@mybeautypass.com" />
                </div>
              </div>
              <GradientButton className="self-end">Save Changes</GradientButton>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="h-full">
            <div className="p-6 h-full flex flex-col">
              <SectionHeader icon={<Lock size={18} />} title="Change Password" />
              <div className="space-y-4 mb-5">
                <PasswordField
                  label="Current Password"
                  value="password123"
                
                  showPassword={showCurrentPassword}
                  onToggleShowPassword={() => setShowCurrentPassword((value) => !value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordField
                    label="New Password"
                    value=""
                 
                    showPassword={showNewPassword}
                    onToggleShowPassword={() => setShowNewPassword((value) => !value)}
                  />
                  <PasswordField
                    label="Confirm New Password"
                    value=""
                  
                    showPassword={showConfirmPassword}
                    onToggleShowPassword={() => setShowConfirmPassword((value) => !value)}
                  />
                </div>
              </div>
              <GradientButton className="self-start">Update Password</GradientButton>
            </div>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card>
          <div className="p-6">
            <SectionHeader icon={<Bell size={18} />} title="Notification Settings" />
            <div className="divide-y divide-gray-50">
              <SettingRow label="Email Notifications" description="Receive email alerts for system events">
                <Toggle checked={emailNotif} onChange={setEmailNotif} />
              </SettingRow>
              <SettingRow label="KYC Approval Alerts" description="Notify when new KYC submissions require review">
                <Toggle checked={kycAlerts} onChange={setKycAlerts} />
              </SettingRow>
              <SettingRow label="Exception Alerts" description="Alert when exception overrides are created">
                <Toggle checked={exceptionAlerts} onChange={setExceptionAlerts} />
              </SettingRow>
              <SettingRow label="System Alerts" description="Receive critical system notifications">
                <Toggle checked={systemAlerts} onChange={setSystemAlerts} />
              </SettingRow>
            </div>
          </div>
        </Card>

        {/* Compliance Settings */}
        <Card>
          <div className="p-6">
            <SectionHeader icon={<Globe size={18} />} title="Compliance Settings" />
            <div className="divide-y divide-gray-50">
              <SettingRow label="Require Dual Approval" description="Require two admins to approve critical actions">
                <Toggle checked={dualApproval} onChange={setDualApproval} />
              </SettingRow>
              <SettingRow label="Auto-Generate Proof Packs" description="Automatically generate proof packs at cycle completion">
                <Toggle checked={autoProofPacks} onChange={setAutoProofPacks} />
              </SettingRow>
            </div>
          </div>
        </Card>

        {/* Footer note */}
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-xl"
          style={{ background: '#FFF4EC', border: '1px solid #FFD6B5' }}
        >
          <span style={{ color: '#E57432', fontSize: '16px', marginTop: '1px' }}>ℹ️</span>
          <p className="text-xs text-gray-500">
            All settings changes are recorded in the system audit log with timestamp and admin identifier.
          </p>
        </div>
      </div>
    </div>
  );
}