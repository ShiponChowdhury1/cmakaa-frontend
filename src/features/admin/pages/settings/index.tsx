import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Eye, EyeOff, Globe, Lock, User } from 'lucide-react';
import { useMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/store/features/auth/authApi';
import { toast } from 'react-toastify';

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
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function InputField({ label, type = 'text', value, onChange, placeholder, disabled = false }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#E57432] uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-lg text-sm text-gray-800 focus:outline-none bg-[#FFF8F2] ${
          disabled ? 'cursor-not-allowed opacity-70' : ''
        }`}
        style={{
          border: '1.5px solid #FFD2B1',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => {
          if (!disabled) e.target.style.borderColor = '#E57432';
        }}
        onBlur={e => {
          if (!disabled) e.target.style.borderColor = '#E8E8E8';
        }}
      />
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggleShowPassword: () => void;
  placeholder?: string;
}

function PasswordField({ label, value, showPassword, onChange, onToggleShowPassword, placeholder }: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#E57432] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
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
      className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold cursor-pointer border-none w-full sm:w-auto ${className}`}
      style={{ ...gradientStyle, transition: 'opacity 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const { data: profileResponse, isLoading, isError } = useMeQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [emailNotif, setEmailNotif] = useState(true);
  const [kycAlerts, setKycAlerts] = useState(true);
  const [exceptionAlerts, setExceptionAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [dualApproval, setDualApproval] = useState(false);
  const [autoProofPacks, setAutoProofPacks] = useState(true);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profile = profileResponse?.data;

  useEffect(() => {
    return () => {
      if (profilePhotoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextPhoto = URL.createObjectURL(file);
    setProfilePhotoFile(file);
    setProfilePhotoPreview((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return nextPhoto;
    });
  };

  const resolvedFirstName = firstName ?? profile?.firstName ?? '';
  const resolvedLastName = lastName ?? profile?.lastName ?? '';
  const resolvedPhoneNumber = phoneNumber ?? profile?.phoneNumber ?? '';

  const handleSaveProfile = async () => {
    setSaveMessage(null);
    setSaveError(null);

    try {
      await updateProfile({
        data: {
          firstName: resolvedFirstName.trim(),
          lastName: resolvedLastName.trim(),
          phoneNumber: resolvedPhoneNumber.trim(),
        },
        profilePicture: profilePhotoFile,
      }).unwrap();

      setSaveMessage('Profile updated successfully.');
      setProfilePhotoFile(null);
      setFirstName(undefined);
      setLastName(undefined);
      setPhoneNumber(undefined);
      toast.success('Profile updated successfully.');

      if (profilePhotoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoPreview);
        setProfilePhotoPreview(null);
      }
    } catch (error: unknown) {
      let message = 'Failed to update profile.';
      if (error && typeof error === 'object' && 'data' in error) {
        const errData = (error as { data: { message?: string } }).data;
        if (errData?.message) {
          message = errData.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setSaveError(message);
      toast.error(message);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordError('Current password and new password are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      }).unwrap();

      if (!response.success) {
        const msg = response.message || 'Failed to change password.';
        setPasswordError(msg);
        toast.error(msg);
        return;
      }

      setPasswordMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      toast.success('Password changed successfully.');
    } catch (error: unknown) {
      let message = 'Failed to change password.';
      if (error && typeof error === 'object' && 'data' in error) {
        const errData = (error as { data: { message?: string } }).data;
        if (errData?.message) {
          message = errData.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setPasswordError(message);
      toast.error(message);
    }
  };

  const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Admin User';
  const displayEmail = profile?.email ?? 'No email available';
  const displayPhone = profile?.phoneNumber ?? 'No phone number available';
  const avatarSrc = profilePhotoPreview ?? profile?.profilePicture ?? null;
  const profileInitials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : 'AU';
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-GB')
    : 'Unknown';
  const updatedDate = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString('en-GB')
    : 'Unknown';

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8" style={{ background: '#F7F8FA', fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
            Loading profile data...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8" style={{ background: '#F7F8FA', fontFamily: 'system-ui, sans-serif' }}>
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
            Failed to load profile data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ background: '#F7F8FA',}}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#E57432' }}>
            Settings
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Configure system preferences and security</p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Admin Profile */}
          <Card className="h-full">
            <div className="p-4 sm:p-6 h-full flex flex-col">
              <SectionHeader icon={<User size={18} />} title="Admin Profile" />
              <div className="flex flex-col sm:flex-row gap-5 mb-5">
                <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#E57432]/30 bg-[#FFF4EC] flex items-center justify-center shadow-sm">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center px-3">
                        <div className="text-2xl mb-1">{profileInitials}</div>
                        <p className="text-[10px] font-semibold text-[#E57432] leading-tight">Profile</p>
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer border-none w-full sm:w-auto" style={gradientStyle}>
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" value={resolvedFirstName} onChange={value => setFirstName(value)} />
                    <InputField label="Last Name" value={resolvedLastName} onChange={value => setLastName(value)} />
                  </div>
                  <InputField label="Phone Number" value={resolvedPhoneNumber} onChange={value => setPhoneNumber(value)} />
                  <InputField label="Email Address" type="email" value={displayEmail} onChange={() => undefined} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-[#FFF8F2] border border-[#FFD2B1] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E57432]">Username</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">@{profile?.username ?? 'admin'}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8F2] border border-[#FFD2B1] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E57432]">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{displayPhone}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8F2] border border-[#FFD2B1] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E57432]">Role</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{profile?.role ?? 'ADMIN'}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8F2] border border-[#FFD2B1] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E57432]">Status</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{profile?.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8F2] border border-[#FFD2B1] px-4 py-3 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E57432]">Account Timeline</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Joined {joinedDate} • Updated {updatedDate}</p>
                </div>
              </div>

              <div className="mt-auto flex flex-col items-end gap-3 w-full">
                {saveMessage && <p className="text-xs font-medium text-green-600">{saveMessage}</p>}
                {saveError && <p className="text-xs font-medium text-red-600">{saveError}</p>}
                <GradientButton className="w-full sm:w-auto" onClick={handleSaveProfile}>
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </GradientButton>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="h-full">
            <div className="p-4 sm:p-6 h-full flex flex-col">
              <SectionHeader icon={<Lock size={18} />} title="Change Password" />
              <div className="space-y-4 mb-5">
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showCurrentPassword}
                  onToggleShowPassword={() => setShowCurrentPassword((value) => !value)}
                  placeholder="Enter current password"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    showPassword={showNewPassword}
                    onToggleShowPassword={() => setShowNewPassword((value) => !value)}
                    placeholder="Enter new password"
                  />
                  <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    showPassword={showConfirmPassword}
                    onToggleShowPassword={() => setShowConfirmPassword((value) => !value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="mt-auto flex flex-col items-start gap-3 w-full">
                {passwordMessage && <p className="text-xs font-medium text-green-600">{passwordMessage}</p>}
                {passwordError && <p className="text-xs font-medium text-red-600">{passwordError}</p>}
                <GradientButton className="w-full sm:w-auto" onClick={handleChangePassword}>
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </GradientButton>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card>
          <div className="p-4 sm:p-6">
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
          <div className="p-4 sm:p-6">
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
      </div>
    </div>
  );
}