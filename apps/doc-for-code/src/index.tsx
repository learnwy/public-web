import React from 'react';
import ReactDom from 'react-dom/client';
import './index.less';
import { App } from './App';

const rootElement = document.getElementById('root')!;

ReactDom.createRoot(rootElement).render(<App />);
