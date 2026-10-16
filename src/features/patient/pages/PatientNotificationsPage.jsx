import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Check,
  Trash2,
  Building2,
  User,
} from 'lucide-react';

export default function PatientNotificationsPage() {
  const navigate = useNavigate();
  const {
    patientNotifications = [],
    markNotificationAsRead,
    clearAllNotifications,
    unreadNotificationsCount = 0,
    showToast,
  } = useDemo();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'queue'

  const queueAlertsCount = patientNotifications.filter(
    (n) => n.type === 'queue_called' || n.isUrgent
  ).length;

  const filteredNotifications = patientNotifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'queue') return n.type === 'queue_called' || n.isUrgent;
    return true;
  });

  const handleMarkAllRead = () => {
    patientNotifications.forEach((n) => {
      if (!n.isRead) markNotificationAsRead(n.id);
    });
    showToast('All notifications marked as read.', 'info');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    showToast('All notifications cleared.', 'info');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--forest-600)',
                }}
              >
                PATIENT PORTAL · UPDATES & ALERTS
              </span>
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                margin: 0,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
              }}
            >
              Notifications & Queue Alerts
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Stay updated on your appointment status, doctor confirmations, and live queue sequence.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleMarkAllRead}
                style={{
                  border: '1.5px solid var(--border-strong)',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--forest-800)',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Check size={14} />
                <span>Mark All Read</span>
              </button>
            )}

            {patientNotifications.length > 0 && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleClearAll}
                style={{
                  border: '1.5px solid #FCA5A5',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#DC2626',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
          }}
        >
          {[
            { id: 'all', label: `All (${patientNotifications.length})` },
            { id: 'unread', label: `Unread (${unreadNotificationsCount})` },
            { id: 'queue', label: `Queue Turns (${queueAlertsCount})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '400',
                  border: '1.5px solid',
                  borderColor: isActive ? 'var(--forest-800)' : '#E5E7EB',
                  backgroundColor: isActive ? 'var(--forest-800)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredNotifications.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid var(--border-subtle)',
                padding: '48px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(14, 56, 44, 0.06)',
                  color: 'var(--forest-800)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Bell size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '400', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
                No notifications found
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 auto', maxWidth: '360px', lineHeight: '1.5' }}>
                {activeTab === 'unread'
                  ? 'All notifications have been read. You are completely caught up!'
                  : activeTab === 'queue'
                  ? 'No live queue turn alerts right now. When your doctor calls you, it will appear here.'
                  : 'You have no notifications yet. Confirmed appointments and queue updates will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isQueueCall = notif.type === 'queue_called' || notif.isUrgent;
              const isConfirmed = notif.type === 'confirmed';
              const isDeclined = notif.type === 'declined' || notif.type === 'cancelled';

              return (
                <div
                  key={notif.id}
                  style={{
                    backgroundColor: isQueueCall ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '16px',
                    border: isQueueCall
                      ? '1.5px solid #10B981'
                      : notif.isRead
                      ? '1px solid var(--border-subtle)'
                      : '1.5px solid var(--forest-800)',
                    padding: '20px 24px',
                    boxShadow: isQueueCall ? '0 4px 18px rgba(16, 185, 129, 0.12)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Top Meta Line: Badge & Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          backgroundColor: isQueueCall
                            ? '#DCFCE7'
                            : isConfirmed
                            ? '#E0F2FE'
                            : isDeclined
                            ? '#FEE2E2'
                            : '#F3F4F6',
                          color: isQueueCall
                            ? '#166534'
                            : isConfirmed
                            ? '#0369A1'
                            : isDeclined
                            ? '#B91C1C'
                            : '#374151',
                          border: `1px solid ${
                            isQueueCall
                              ? '#86EFAC'
                              : isConfirmed
                              ? '#BAE6FD'
                              : isDeclined
                              ? '#FCA5A5'
                              : '#E5E7EB'
                          }`,
                        }}
                      >
                        {isQueueCall
                          ? 'YOUR TURN NOW'
                          : isConfirmed
                          ? '✓ CONFIRMED'
                          : isDeclined
                          ? '✕ DECLINED'
                          : 'NOTIFICATION'}
                      </span>

                      {!notif.isRead && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: '#EF4444',
                          }}
                          title="Unread"
                        />
                      )}
                    </div>

                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {notif.timestamp || 'Just now'}
                    </span>
                  </div>

                  {/* Title & Simple Message */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                      {notif.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                      {notif.message ? notif.message.replace(/Dr\.\s+Dr\./g, 'Dr.') : ''}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                      paddingTop: '12px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isQueueCall && (
                        <button
                          type="button"
                          className="btn-lime-pill"
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            navigate('/appointments');
                          }}
                          style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '400' }}
                        >
                          <Building2 size={14} />
                          <span>View Appointment Details</span>
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          type="button"
                          className="btn-white-capsule"
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            navigate('/appointments');
                          }}
                          style={{
                            border: '1.5px solid var(--forest-800)',
                            color: 'var(--forest-800)',
                            padding: '7px 16px',
                            fontSize: '12.5px',
                            fontWeight: '400',
                          }}
                        >
                          <span>View in My Appointments</span>
                        </button>
                      )}

                      {isDeclined && (
                        <button
                          type="button"
                          className="btn-white-capsule"
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            navigate('/doctors');
                          }}
                          style={{
                            border: '1.5px solid #DC2626',
                            color: '#DC2626',
                            padding: '7px 16px',
                            fontSize: '12.5px',
                            fontWeight: '400',
                          }}
                        >
                          <span>Find Another Doctor</span>
                        </button>
                      )}
                    </div>

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notif.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: '4px 8px',
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
