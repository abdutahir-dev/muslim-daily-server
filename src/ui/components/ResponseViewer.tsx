import React, { useState } from 'react';
import { Card, Typography, Tag, Space, Button, message, Tabs, Empty } from 'antd';
import {
  CopyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type { ResponseResult } from '../types.js';

const { Text } = Typography;

interface ResponseViewerProps {
  result: ResponseResult | null;
  loading: boolean;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ result, loading }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('data');

  const handleCopy = () => {
    if (!result) return;
    const text = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    message.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'processing';
    if (status >= 400 && status < 500) return 'warning';
    return 'error';
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {/* Response Header Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Space size="middle">
          <Text strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Response Output
          </Text>
          {result && (
            <>
              <Tag color={getStatusColor(result.status)} style={{ margin: 0, fontWeight: 600, borderRadius: 6 }}>
                {result.status} {result.statusText}
              </Tag>
              <Space size="small">
                <ClockCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                <Text style={{ fontSize: 12, color: '#64748b' }}>{result.durationMs}ms</Text>
              </Space>
              <Space size="small">
                <DatabaseOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                <Text style={{ fontSize: 12, color: '#64748b' }}>
                  {result.sizeBytes < 1024
                    ? `${result.sizeBytes} B`
                    : `${(result.sizeBytes / 1024).toFixed(1)} KB`}
                </Text>
              </Space>
            </>
          )}
        </Space>

        {result && (
          <Button
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            style={{ borderRadius: 6 }}
          >
            {copied ? 'Copied' : 'Copy Response'}
          </Button>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
          <Space direction="vertical" align="center">
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid #e2e8f0',
                borderTopColor: '#059669',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Executing request...
            </Text>
          </Space>
        </div>
      ) : !result ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                Select an endpoint or choose a quick test card, then click &ldquo;Send Request&rdquo; to inspect live JSON responses.
              </Text>
            }
          />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          items={[
            {
              key: 'data',
              label: (
                <span>
                  <CodeOutlined style={{ marginRight: 4 }} />
                  Body JSON
                </span>
              ),
              children: (
                <div
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    padding: 16,
                    borderRadius: 8,
                    overflow: 'auto',
                    maxHeight: '520px',
                    fontSize: 12,
                    lineHeight: '18px',
                    fontFamily: '"JetBrains Mono", Consolas, Menlo, monospace',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {typeof result.data === 'string'
                      ? result.data
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ),
            },
            {
              key: 'headers',
              label: 'Headers',
              children: (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  {Object.entries(result.headers).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <Text strong style={{ fontSize: 12 }}>{key}</Text>
                      <Text code style={{ fontSize: 11 }}>{value}</Text>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </Card>
  );
};
