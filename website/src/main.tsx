import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './App'
import 'mapbox-gl/dist/mapbox-gl.css';

createRoot(document.getElementById('root')!).render(<App />);