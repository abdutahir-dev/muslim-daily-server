import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import {
  ThunderboltOutlined,
  CompassOutlined,
  BookOutlined,
  CalendarOutlined,
  CloudServerOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { ApiEndpoint } from '../types.js';
import { ENDPOINTS } from '../constants/endpoints.js';

const { Text } = Typography;

interface QuickDeckProps {
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
  onExecuteImmediately: (endpoint: ApiEndpoint) => void;
}

export const QuickDeck: React.FC<QuickDeckProps> = ({ onSelectEndpoint, onExecuteImmediately }) => {
  const quickCards = [
    {
      title: "Today's Prayers",
      desc: 'Astronomical timings for Fajr, Dhuhr, Asr, Maghrib, Isha',
      icon: <CompassOutlined style={{ fontSize: 20, color: '#059669' }} />,
      endpointId: 'prayers-today',
      badge: 'GET',
      badgeColor: 'blue',
    },
    {
      title: 'Surah Al-Fatihah',
      desc: 'Complete 7 Ayahs with Uthmani text and translation',
      icon: <BookOutlined style={{ fontSize: 20, color: '#2563eb' }} />,
      endpointId: 'quran-surah-detail',
      badge: 'GET',
      badgeColor: 'blue',
    },
    {
      title: 'Daily Hadith',
      desc: 'Deterministic daily wisdom from authentic collections',
      icon: <ThunderboltOutlined style={{ fontSize: 20, color: '#d97706' }} />,
      endpointId: 'hadith-daily',
      badge: 'GET',
      badgeColor: 'blue',
    },
    {
      title: 'Firebase Config',
      desc: 'Verify Project ID & Cloud Firestore database mapping',
      icon: <FireOutlined style={{ fontSize: 20, color: '#ea580c' }} />,
      endpointId: 'firebase-config',
      badge: 'GET',
      badgeColor: 'orange',
    },
    {
      title: 'Calendar Conversion',
      desc: 'Gregorian to Islamic Hijri and Ethiopian conversion',
      icon: <CalendarOutlined style={{ fontSize: 20, color: '#7c3aed' }} />,
      endpointId: 'calendar-convert',
      badge: 'GET',
      badgeColor: 'purple',
    },
    {
      title: 'System Health',
      desc: 'Check SQLite databases and server heartbeat',
      icon: <CloudServerOutlined style={{ fontSize: 20, color: '#0d9488' }} />,
      endpointId: 'system-health',
      badge: 'GET',
      badgeColor: 'green',
    },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
          Quick Action Bench (1-Click Run)
        </Text>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {quickCards.map((card) => {
          const endpoint = ENDPOINTS.find((e) => e.id === card.endpointId);
          if (!endpoint) return null;

          return (
            <Card
              key={card.title}
              hoverable
              size="small"
              onClick={() => {
                onSelectEndpoint(endpoint);
                onExecuteImmediately(endpoint);
              }}
              style={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ padding: 6, borderRadius: 8, backgroundColor: '#f8fafc' }}>{card.icon}</div>
                <Tag color={card.badgeColor} style={{ margin: 0, fontSize: 10, borderRadius: 6 }}>
                  {card.badge}
                </Tag>
              </div>
              <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 2 }}>
                {card.title}
              </Text>
              <Text type="secondary" style={{ fontSize: 11, lineHeight: '14px', display: 'block' }}>
                {card.desc}
              </Text>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
