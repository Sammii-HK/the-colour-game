'use client';

import { useState } from 'react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  unsubscribedAt?: string;
}

interface SubscriberStats {
  success: boolean;
  count: number;
  activeCount: number;
  subscribers: Subscriber[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');

  const fetchStats = async () => {
    if (!adminKey) return;
    
    setLoading(true);
    console.log('Attempting to fetch stats with admin key:', adminKey.substring(0, 10) + '...');
    
    try {
      const response = await fetch('/api/admin/subscribers', {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json() as SubscriberStats;
        console.log('Stats data:', data);
        setStats(data);
        setAuthenticated(true);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        setAuthenticated(false);
        alert(`Authentication failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error fetching stats:', error);
      alert('Network error - check console for details');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats();
  };

  const sendTestEmail = async () => {
    setEmailLoading(true);
    setEmailStatus('');
    
    try {
      // Use the CRON_SECRET_KEY for the email API (different from admin key)
      const cronSecret = 'c7d49d0f8abf5d1b931b0ec088fe862401f86fa8a51e7ac19a629f607404f8d7';
      
      const response = await fetch('/api/send-daily-email?force=true', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json() as { recipients?: number; colour?: string };
        setEmailStatus(`✅ Email sent successfully to ${result.recipients || 0} recipient(s)! Color: ${result.colour || 'Unknown'}`);
      } else {
        const error = await response.text();
        setEmailStatus(`❌ Failed to send email: ${error}`);
      }
    } catch (error) {
      setEmailStatus(`❌ Error: ${error}`);
    } finally {
      setEmailLoading(false);
    }
  };

  const previewEmail = () => {
    // Open the actual email template preview
    window.open('/api/preview-email', '_blank');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🔐 Admin Access
          </h1>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-neutral-400"
                placeholder="Enter admin secret key"
              />
            </div>
            <button
              type="submit"
              disabled={!adminKey || loading}
              className="w-full bg-gray-800 dark:bg-neutral-700 text-white py-3 px-4 rounded-lg hover:bg-gray-900 dark:hover:bg-neutral-600 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">The Colour Game Email Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Emails</p>
                <p className="text-2xl font-bold text-gray-900">Free Tier</p>
                <p className="text-xs text-gray-500">300/day via Brevo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Subscribers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {stats?.subscribers?.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Testing */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email Testing</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={previewEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              📧 Preview Actual Email Template
            </button>
            <button
              onClick={sendTestEmail}
              disabled={emailLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {emailLoading ? '📤 Sending...' : '📤 Send Test Email'}
            </button>
          </div>
          {emailStatus && (
            <div className={`p-3 rounded-md text-sm ${
              emailStatus.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {emailStatus}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email Service:</span>
                <span className="font-medium text-green-600">Brevo (Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Worker Status:</span>
                <span className="font-medium text-green-600">Deployed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domain:</span>
                <span className="font-medium">daily@thecolorgame.uk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Email:</span>
                <span className="font-medium">7:30 AM London</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Today's Color</h3>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg shadow-lg mb-3" 
                   style={{backgroundColor: '#F5FFFA'}}></div>
              <p className="font-semibold text-gray-900">MintCream</p>
              <p className="text-sm text-gray-600">#F5FFFA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
