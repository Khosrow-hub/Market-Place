import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data.data.stats);
      setError(null);
    } catch (err) {
      setError(t('error.networkError'));
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchAdminStats} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>{t('admin.title')}</h1>
        <p> Welcome, {user?.fullName || user?.username}! Here's your dashboard overview. </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>{t('admin.totalUsers')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>{t('admin.totalProducts')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>{t('admin.totalOrders')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats?.totalRevenue?.toLocaleString() || 0}</h3>
            <p>{t('admin.totalRevenue')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats?.pendingOrders || 0}</h3>
            <p>{t('admin.pendingOrders')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats?.completedOrders || 0}</h3>
            <p>{t('admin.completedOrders')}</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <div className="action-card">
          <h3>{t('admin.userManagement')}</h3>
          <p>Manage user accounts, roles, and permissions</p>
          <button 
            onClick={() => window.location.href = '/admin/users'}
            className="btn btn-primary"
          >
            Manage Users
          </button>
        </div>

        <div className="action-card">
          <h3>{t('admin.productManagement')}</h3>
          <p>Approve and manage product listings</p>
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="btn btn-primary"
          >
            Manage Products
          </button>
        </div>

        <div className="action-card">
          <h3>{t('admin.orderManagement')}</h3>
          <p>Monitor and process customer orders</p>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="btn btn-primary"
          >
            Manage Orders
          </button>
        </div>

        <div className="action-card">
          <h3>{t('admin.analytics')}</h3>
          <p>View detailed analytics and reports</p>
          <button 
            onClick={() => window.location.href = '/admin/analytics'}
            className="btn btn-primary"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;