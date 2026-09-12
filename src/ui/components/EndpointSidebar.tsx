import React, { useState } from 'react';
import { Input, Tag, Typography, Badge, Tabs } from 'antd';
import { SearchOutlined, LockOutlined } from '@ant-design/icons';
import type { ApiEndpoint } from '../types.js';
import { API_CATEGORIES, ENDPOINTS } from '../constants/endpoints.js';

const { Text } = Typography;

interface EndpointSidebarProps {
  selectedEndpoint: ApiEndpoint;
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return '#2563eb';
    case 'POST':
      return '#059669';
    case 'PUT':
      return '#d97706';
    case 'DELETE':
      return '#dc2626';
    default:
      return '#64748b';
  }
};

export const EndpointSidebar: React.FC<EndpointSidebarProps> = ({ selectedEndpoint, onSelectEndpoint }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredEndpoints = ENDPOINTS.filter((ep) => {
    const matchesCategory = activeCategory === 'All' || ep.category === activeCategory;
    const matchesSearch =
      !search ||
      ep.name.toLowerCase().includes(search.toLowerCase()) ||
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        borderRadius: '0 0 0 12px',
      }}
    >
      <div style={{ padding: '16px 16px 12px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Filter endpoints (e.g. prayer, surah, hadith)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ borderRadius: 8, fontSize: 13 }}
        />
      </div>

      <div style={{ padding: '4px 12px 0 12px', borderBottom: '1px solid #f1f5f9', overflowX: 'auto' }}>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          size="small"
          tabBarStyle={{ marginBottom: 0 }}
          items={API_CATEGORIES.map((cat) => ({
            key: cat,
            label: (
              <span style={{ fontSize: 12 }}>
                {cat}
                {cat === 'All' ? ` (${ENDPOINTS.length})` : ''}
              </span>
            ),
          }))}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {filteredEndpoints.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              No endpoints found matching &ldquo;{search}&rdquo;
            </Text>
          </div>
        ) : (
          filteredEndpoints.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => onSelectEndpoint(ep)}
                style={{
                  padding: '10px 12px',
                  marginBottom: 4,
                  borderRadius: 8,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                  border: isSelected ? '1px solid #a7f3d0' : '1px solid transparent',
                  transition: 'all 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        color: '#ffffff',
                        backgroundColor: getMethodColor(ep.method),
                      }}
                    >
                      {ep.method}
                    </span>
                    <Text strong style={{ fontSize: 13, color: isSelected ? '#065f46' : '#1e293b' }}>
                      {ep.name}
                    </Text>
                  </div>
                  {ep.requiresAuth && (
                    <Tag icon={<LockOutlined />} color="warning" style={{ margin: 0, fontSize: 10, borderRadius: 4 }}>
                      Auth
                    </Tag>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    code
                    style={{
                      fontSize: 11,
                      backgroundColor: isSelected ? '#d1fae5' : '#f1f5f9',
                      color: isSelected ? '#047857' : '#475569',
                      border: 'none',
                    }}
                  >
                    {ep.path}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    {ep.category}
                  </Text>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
