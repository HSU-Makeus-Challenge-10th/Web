/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

import React from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    type Element = React.ReactNode;
  }
}
