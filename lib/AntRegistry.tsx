'use client';

import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import ErrorBoundary from './ErrorBoundry';

const StyledComponentsRegistry = ({ children, Component, pageProps }: { children: React.ReactNode, Component: any, pageProps: any }) => {
  const cache = createCache();
  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));
  return (
    <StyleProvider cache={cache}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      
    </StyleProvider>);
};

export default StyledComponentsRegistry;