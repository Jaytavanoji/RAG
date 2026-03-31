import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest('/api/notifications');
      setNotifications(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Failed to sync notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/api/notifications/mark-all-read', 'POST');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'UNKNOWN';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} MINS AGO`;
    if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
    if (diffDays === 1) return 'YESTERDAY';
    return date.toLocaleDateString();
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Synchronizing Neural Broadcasts...</div>;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="max-w-xl">
          <span className="font-label text-[10px] uppercase tracking-[3px] text-primary-container font-bold">System Broadcasts</span>
          <h3 className="font-headline text-4xl font-extrabold text-on-surface mt-2 tracking-tight text-white">Updates & Alerts</h3>
          <p className="text-on-surface-variant mt-4 leading-relaxed">Stay informed about sovereign intelligence activities, neural processing status, and security protocols across the RegiNova ecosystem.</p>
        </div>
        <div className="text-right">
          <button 
            onClick={handleMarkAllRead}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(211,47,47,0.2)]"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`group relative p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-white/5 ${
                notif.is_read 
                  ? 'bg-surface-container-low hover:bg-surface-container-high' 
                  : 'bg-surface-variant/20 backdrop-blur-xl shadow-[0_0_15px_rgba(211,47,47,0.1)]'
              }`}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notif.is_read ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary-container/10 text-primary-container'
                  }`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: notif.is_read ? "" : "'FILL' 1" }}>{notif.icon || 'info'}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <h4 className="font-headline text-lg font-bold text-on-surface tracking-tight text-white">{notif.title}</h4>
                    <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant opacity-60 font-medium">{formatTime(notif.created_at)}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{notif.description}</p>
                  <div className="flex items-center gap-3 mt-4">
                    {!notif.is_read && <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>}
                    <span className={`text-[10px] font-label font-bold uppercase tracking-wider ${
                      notif.is_read ? 'text-on-surface-variant opacity-60' : 'text-primary-container'
                    }`}>
                      {notif.notification_type || notif.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-on-surface-variant opacity-30">
            No notifications in the neural queue.
          </div>
        )}
      </div>

      <div className="mt-16 bg-surface-container-low p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary-container/20 transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary-container/10 transition-colors"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h5 className="font-headline text-xl font-bold text-on-surface text-white">Manage Notifications</h5>
            <p className="text-on-surface-variant text-sm mt-2">Adjust your frequency and priority preferences in the master settings.</p>
          </div>
          <button className="bg-surface-container-high text-primary-container px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-surface-bright border border-white/5">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
