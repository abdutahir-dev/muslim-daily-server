import React, { useState } from 'react';
import { Button, Modal, Input, Tag, Space, Typography, Tooltip, message, Radio } from 'antd';
import { KeyOutlined, CheckCircleOutlined, SafetyCertificateOutlined, CloudServerOutlined, BookOutlined } from '@ant-design/icons';
import type { AuthState } from '../types.js';

const { Text } = Typography;

interface AuthBarProps {
  authState: AuthState;
  onUpdateAuth: (newAuth: AuthState) => void;
}

export const AuthBar: React.FC<AuthBarProps> = ({ authState, onUpdateAuth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempToken, setTempToken] = useState(authState.token);
  const [tokenType, setTokenType] = useState<'bearer' | 'firebase'>(authState.tokenType);

  const handleSave = () => {
    onUpdateAuth({
      ...authState,
      token: tempToken.trim(),
      tokenType
    });
    setIsModalOpen(false);
    message.success('Authentication credentials saved');
  };

  const handleClear = () => {
    setTempToken('');
    onUpdateAuth({
      ...authState,
      token: '',
      tokenType: 'bearer'
    });
    setIsModalOpen(false);
    message.info('Authentication cleared');
  };

  const hasToken = Boolean(authState.token);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        borderRadius: '12px 12px 0 0',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              flexShrink: 0,
            }}
          />
          <Text strong style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
            Muslim Daily Server
          </Text>
          <Tag color="emerald" style={{ margin: 0, borderRadius: 10, fontSize: 11 }}>
            v2.0.0
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Tag icon={<CloudServerOutlined />} color="cyan" style={{ margin: 0, borderRadius: 10, fontSize: 11 }}>
            Port 3000
          </Tag>
          <Tag icon={<SafetyCertificateOutlined />} color="purple" style={{ margin: 0, borderRadius: 10, fontSize: 11 }}>
            Firestore Connected
          </Tag>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'flex-start',
        }}
      >
        <Tooltip title="Download Postman Collections">
          <Button
            type="text"
            icon={<BookOutlined />}
            href="/#postman-collections"
            target="_blank"
            size="middle"
            style={{ borderRadius: 8, padding: '4px 10px', fontSize: 13 }}
          >
            Postman Collections
          </Button>
        </Tooltip>

        <Tooltip title="View Interactive Swagger UI">
          <Button
            type="text"
            icon={<BookOutlined />}
            href="/swagger"
            target="_blank"
            size="middle"
            style={{ borderRadius: 8, padding: '4px 10px', fontSize: 13 }}
          >
            Swagger UI
          </Button>
        </Tooltip>

        <Tooltip title="View Developer Docs">
          <Button
            type="text"
            icon={<BookOutlined />}
            href="/docs"
            target="_blank"
            size="middle"
            style={{ borderRadius: 8, padding: '4px 10px', fontSize: 13 }}
          >
            REST Docs
          </Button>
        </Tooltip>

        <Button
          type={hasToken ? 'primary' : 'default'}
          icon={<KeyOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            borderRadius: 8,
            backgroundColor: hasToken ? '#059669' : undefined,
            borderColor: hasToken ? '#059669' : undefined,
            fontSize: 13,
          }}
          size="middle"
        >
          {hasToken ? 'Authenticated' : 'Configure Auth'}
        </Button>
      </div>

      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#059669' }} />
            <span>API Authentication Token</span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="clear" danger onClick={handleClear}>
            Clear Token
          </Button>,
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
          >
            Save Token
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%', marginTop: 12 }} size="middle">
          <Text type="secondary" style={{ fontSize: 13 }}>
            Select your token type and paste the Bearer token or Firebase ID token to test authenticated endpoints (/api/firebase/*, /api/journal/*, etc.).
          </Text>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 6 }}>
              Token Type
            </Text>
            <Radio.Group
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="firebase">Firebase ID Token</Radio.Button>
              <Radio.Button value="bearer">Standard JWT</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 6 }}>
              Token Value
            </Text>
            <Input.TextArea
              rows={4}
              placeholder="Paste Bearer token here..."
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 12, borderRadius: 8 }}
            />
          </div>

          {tokenType === 'firebase' && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <Text style={{ fontSize: 12, color: '#166534' }}>
                <CheckCircleOutlined style={{ marginRight: 6 }} />
                Firebase tokens are verified against Cloud Firestore database{' '}
                <code>ai-studio-muslimdailyserve</code>.
              </Text>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};
