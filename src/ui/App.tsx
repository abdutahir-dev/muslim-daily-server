import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Layout, message, Typography } from 'antd';
import { AuthBar } from './components/AuthBar.js';
import { QuickDeck } from './components/QuickDeck.js';
import { EndpointSidebar } from './components/EndpointSidebar.js';
import { RequestTester } from './components/RequestTester.js';
import { ResponseViewer } from './components/ResponseViewer.js';
import { ENDPOINTS } from './constants/endpoints.js';
import type { ApiEndpoint, AuthState, ResponseResult } from './types.js';

const { Header, Content } = Layout;
const { Text } = Typography;

const STORAGE_AUTH_KEY = 'muslim_daily_api_auth';

export const App: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<ResponseResult | null>(null);

  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
    return { tokenType: 'firebase', token: '' };
  });

  const handleUpdateAuth = (newAuth: AuthState) => {
    setAuthState(newAuth);
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newAuth));
    } catch {
      // Ignored
    }
  };

  const handleExecuteRequest = useCallback(
    async (
      resolvedPath: string,
      method: string,
      queryParams: Record<string, string>,
      headers: Record<string, string>,
      body?: string
    ) => {
      setLoading(true);
      const startTime = performance.now();

      // Build full URL
      const url = new URL(resolvedPath, window.location.origin);
      Object.entries(queryParams).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });

      try {
        const fetchOptions: RequestInit = {
          method,
          headers,
        };

        if (body && method !== 'GET') {
          fetchOptions.body = body;
        }

        const res = await fetch(url.toString(), fetchOptions);
        const endTime = performance.now();
        const durationMs = Math.round(endTime - startTime);

        // Parse response headers
        const resHeaders: Record<string, string> = {};
        res.headers.forEach((val, key) => {
          resHeaders[key] = val;
        });

        // Determine content-type and parse data
        const contentType = res.headers.get('content-type') || '';
        let data: unknown;
        let textLen = 0;

        if (contentType.includes('application/json')) {
          data = await res.json();
          textLen = JSON.stringify(data).length;
        } else {
          const text = await res.text();
          textLen = text.length;
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }
        }

        setResponseResult({
          status: res.status,
          statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
          durationMs,
          sizeBytes: textLen,
          headers: resHeaders,
          data,
          timestamp: new Date().toLocaleTimeString(),
          isError: !res.ok,
        });

        if (res.ok) {
          message.success(`Request completed with status ${res.status}`);
        } else {
          message.warning(`Request failed with status ${res.status}`);
        }
      } catch (err: unknown) {
        const endTime = performance.now();
        const durationMs = Math.round(endTime - startTime);
        const errMsg = err instanceof Error ? err.message : String(err);

        setResponseResult({
          status: 0,
          statusText: 'Network / Connection Error',
          durationMs,
          sizeBytes: 0,
          headers: {},
          data: {
            error: 'Network request failed',
            details: errMsg,
            tip: 'Check your connection or verify that the server is responding on port 3000.',
          },
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        });
        message.error(`Network error: ${errMsg}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleExecuteImmediately = (endpoint: ApiEndpoint) => {
    let path = endpoint.path;
    const queryParams: Record<string, string> = {};

    if (endpoint.params) {
      endpoint.params.forEach((p) => {
        const val = p.defaultValue || '';
        if (p.type === 'path') {
          path = path.replace(`{${p.name}}`, encodeURIComponent(val));
        } else if (p.type === 'query' && val) {
          queryParams[p.name] = val;
        }
      });
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (authState.token) {
      headers['Authorization'] = `Bearer ${authState.token}`;
    }

    handleExecuteRequest(
      path,
      endpoint.method,
      queryParams,
      headers,
      endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody) : undefined
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#059669',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f2f2f7' }}>
        {/* Navigation Bar */}
        <Header style={{ padding: 0, height: 'auto', backgroundColor: '#ffffff', lineHeight: 'normal' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            <AuthBar authState={authState} onUpdateAuth={handleUpdateAuth} />
          </div>
        </Header>

        {/* Main Content Area */}
        <Content style={{ padding: '16px 12px', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Quick Deck Benchmark */}
          <QuickDeck
            onSelectEndpoint={setSelectedEndpoint}
            onExecuteImmediately={handleExecuteImmediately}
          />

          {/* Workbench Split: Sidebar + Request/Response View */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: 16,
              minHeight: 650,
              width: '100%',
            }}
          >
            {/* Left Column: Endpoints Directory */}
            <EndpointSidebar
              selectedEndpoint={selectedEndpoint}
              onSelectEndpoint={setSelectedEndpoint}
            />

            {/* Right Column: Active Tester & Live Response */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <RequestTester
                endpoint={selectedEndpoint}
                authState={authState}
                onExecute={handleExecuteRequest}
                loading={loading}
              />

              <ResponseViewer result={responseResult} loading={loading} />
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
