import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './AccountPages.css';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState({ fullName: '', phoneNumber: '', street: '', city: '', state: '', country: '', postalCode: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setProfile({ fullName: user.fullName || '', phoneNumber: user.phoneNumber || '', street: user.address?.street || '', city: user.address?.city || '', state: user.address?.state || '', country: user.address?.country || '', postalCode: user.address?.postalCode || '' });
  }, [user]);

  const updateProfile = async event => {
    event.preventDefault(); setMessage(''); setError('');
    try { await authAPI.updateProfile({ fullName: profile.fullName, phoneNumber: profile.phoneNumber, address: { street: profile.street, city: profile.city, state: profile.state, country: profile.country, postalCode: profile.postalCode } }); await refreshProfile(); setMessage('Profile saved.'); } catch (requestError) { setError(requestError.response?.data?.message || 'Could not save your profile.'); }
  };
  const changePassword = async event => {
    event.preventDefault(); setMessage(''); setError('');
    try { await authAPI.changePassword(passwords); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage('Password changed.'); } catch (requestError) { setError(requestError.response?.data?.message || 'Could not change your password.'); }
  };
  const change = event => setProfile(current => ({ ...current, [event.target.name]: event.target.value }));
  const passwordChange = event => setPasswords(current => ({ ...current, [event.target.name]: event.target.value }));

  return <div className="account-page"><div className="account-container">
    <form className="account-card account-form-grid" onSubmit={updateProfile}><h1 className="full-width">Your profile</h1><label>Full name<input required name="fullName" value={profile.fullName} onChange={change} /></label><label>Phone number<input name="phoneNumber" value={profile.phoneNumber} onChange={change} /></label><label className="full-width">Street address<input name="street" value={profile.street} onChange={change} /></label><label>City<input name="city" value={profile.city} onChange={change} /></label><label>Province / State<input name="state" value={profile.state} onChange={change} /></label><label>Country<input name="country" value={profile.country} onChange={change} /></label><label>Postal code<input name="postalCode" value={profile.postalCode} onChange={change} /></label><div className="full-width"><button className="primary-action">Save profile</button></div></form>
    <form className="account-card account-form-grid" onSubmit={changePassword}><h2 className="full-width">Change password</h2><label className="full-width">Current password<input required type="password" name="currentPassword" value={passwords.currentPassword} onChange={passwordChange} /></label><label>New password<input required minLength="6" type="password" name="newPassword" value={passwords.newPassword} onChange={passwordChange} /></label><label>Confirm new password<input required minLength="6" type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={passwordChange} /></label><div className="full-width"><button className="secondary-action">Change password</button>{message && <p className="form-message">{message}</p>}{error && <p className="form-error">{error}</p>}</div></form>
  </div></div>;
};

export default ProfilePage;
