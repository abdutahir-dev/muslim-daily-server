import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Tag, Space, Typography, Tabs, Form, Select, Alert, Tooltip } from 'antd';
import { PlayCircleOutlined, FormatPainterOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { ApiEndpoint, AuthState } from '../types.js';

const { Text } = Typography;

interface RequestTesterProps {
  endpoint: ApiEndpoint;
  authState: AuthState;
  onExecute: (resolvedPath: string, method: string, queryParams: Record<string, string>, headers: Record<string, string>, body?: string) => void;
  loading: boolean;
}

export const RequestTester: React.FC<RequestTesterProps> = ({
  endpoint,
  authState,
  onExecute,
  loading,
}) => {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [customBody, setCustomBody] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('params');
  const [bodyError, setBodyError] = useState<string | null>(null);

  // Initialize parameters when endpoint changes
  useEffect(() => {
    const initial: Record<string, string> = {};
    if (endpoint.params) {
      endpoint.params.forEach((p) => {
        initial[p.name] = p.defaultValue || '';
      });
    }
    setParamValues(initial);

    if (endpoint.sampleBody) {
      setCustomBody(JSON.stringify(endpoint.sampleBody, null, 2));
    } else {
      setCustomBody('');
    }
    setBodyError(null);
  }, [endpoint]);

  // Compute resolved path replacing path params and building query string
  const computeResolvedUrl = () => {
    let path = endpoint.path;
    const queryParts: string[] = [];

    if (endpoint.params) {
      endpoint.params.forEach((p) => {
        const val = paramValues[p.name] ?? p.defaultValue ?? '';
        if (p.type === 'path') {
          path = path.replace(`{${p.name}}`, encodeURIComponent(val));
        } else if (p.type === 'query' && val) {
          queryParts.push(`${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`);
        }
      });
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `${path}${queryString}`;
  };

  const handleSend = () => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (endpoint.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    if (authState.token) {
      headers['Authorization'] = `Bearer ${authState.token}`;
    }

    const queryParams: Record<string, string> = {};
    if (endpoint.params) {
      endpoint.params.forEach((p) => {
        if (p.type === 'query' && paramValues[p.name]) {
          queryParams[p.name] = paramValues[p.name];
        }
      });
    }

    let finalPath = endpoint.path;
    if (endpoint.params) {
      endpoint.params.forEach((p) => {
        if (p.type === 'path') {
          const val = paramValues[p.name] ?? p.defaultValue ?? '';
          finalPath = finalPath.replace(`{${p.name}}`, encodeURIComponent(val));
        }
      });
    }

    onExecute(
      finalPath,
      endpoint.method,
      queryParams,
      headers,
      endpoint.method !== 'GET' && customBody ? customBody : undefined
    );
  };

  const prettifyJson = () => {
    try {
      if (!customBody) return;
      const parsed = JSON.parse(customBody);
      setCustomBody(JSON.stringify(parsed, null, 2));
      setBodyError(null);
    } catch (err: unknown) {
      setBodyError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const resetSample = () => {
    if (endpoint.sampleBody) {
      setCustomBody(JSON.stringify(endpoint.sampleBody, null, 2));
      setBodyError(null);
    }
  };

  const resolvedUrl = computeResolvedUrl();

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        marginBottom: 16,
      }}
      bodyStyle={{ padding: 16 }}
    >
      {/* Endpoint URL Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          padding: '8px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        }}
      >
        <Tag
          color={
            endpoint.method === 'GET'
              ? 'blue'
              : endpoint.method === 'POST'
              ? 'green'
              : endpoint.method === 'PUT'
              ? 'orange'
              : 'red'
          }
          style={{ fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}
        >
          {endpoint.method}
        </Tag>
        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Text code style={{ fontSize: 13, color: '#0f172a', border: 'none', backgroundColor: 'transparent' }}>
            {resolvedUrl}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{
            backgroundColor: '#059669',
            borderColor: '#059669',
            borderRadius: 8,
            fontWeight: 600,
            padding: '0 18px',
          }}
        >
          Send Request
        </Button>
      </div>

      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 14 }}>
        {endpoint.description}
      </Text>

      {/* Tabs: Parameters, Headers, Body */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'params',
            label: `Parameters (${endpoint.params ? endpoint.params.length : 0})`,
            children: (
              <div>
                {!endpoint.params || endpoint.params.length === 0 ? (
                  <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic', display: 'block', padding: '8px 0' }}>
                    This endpoint does not require any path or query parameters.
                  </Text>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {endpoint.params.map((param) => (
                      <div
                        key={param.name}
                        style={{
                          padding: 10,
                          backgroundColor: '#f8fafc',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Space size="small">
                            <Text strong style={{ fontSize: 12 }}>
                              {param.name}
                            </Text>
                            {param.required && <Tag color="error" style={{ fontSize: 10, margin: 0 }}>Required</Tag>}
                          </Space>
                          <Tag style={{ fontSize: 10, margin: 0 }}>{param.type}</Tag>
                        </div>

                        {param.options ? (
                          <Select
                            size="small"
                            value={paramValues[param.name] ?? param.defaultValue}
                            onChange={(val) => setParamValues((prev) => ({ ...prev, [param.name]: val }))}
                            style={{ width: '100%' }}
                            options={param.options.map((opt) => ({ label: opt, value: opt }))}
                          />
                        ) : (
                          <Input
                            size="small"
                            placeholder={param.description}
                            value={paramValues[param.name] ?? ''}
                            onChange={(e) =>
                              setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))
                            }
                            style={{ borderRadius: 6, fontSize: 12 }}
                          />
                        )}
                        <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                          {param.description}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'headers',
            label: 'Headers',
            children: (
              <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text strong style={{ fontSize: 12 }}>Accept</Text>
                  <Text code style={{ fontSize: 11 }}>application/json</Text>
                </div>
                {endpoint.method !== 'GET' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 12 }}>Content-Type</Text>
                    <Text code style={{ fontSize: 11 }}>application/json</Text>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 12 }}>Authorization</Text>
                  <Text code style={{ fontSize: 11 }}>
                    {authState.token ? `Bearer ${authState.token.slice(0, 12)}...` : 'None (Guest)'}
                  </Text>
                </div>
              </div>
            ),
          },
          ...(endpoint.method !== 'GET'
            ? [
                {
                  key: 'body',
                  label: 'Request Body (JSON)',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 6 }}>
                        {endpoint.sampleBody && (
                          <Button size="small" icon={<ReloadOutlined />} onClick={resetSample}>
                            Reset Sample
                          </Button>
                        )}
                        <Button size="small" icon={<FormatPainterOutlined />} onClick={prettifyJson}>
                          Prettify JSON
                        </Button>
                      </div>
                      <Input.TextArea
                        rows={6}
                        value={customBody}
                        onChange={(e) => {
                          setCustomBody(e.target.value);
                          setBodyError(null);
                        }}
                        placeholder='{ "key": "value" }'
                        style={{ fontFamily: 'monospace', fontSize: 12, borderRadius: 8 }}
                      />
                      {bodyError && (
                        <Alert
                          message={bodyError}
                          type="error"
                          showIcon
                          style={{ marginTop: 8, borderRadius: 6 }}
                        />
                      )}
                    </div>
                  ),
                },
              ]
            : []),
        ]}
      />
    </Card>
  );
};
