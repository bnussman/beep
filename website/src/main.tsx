import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import 'mapbox-gl/dist/mapbox-gl.css';

// Refer to https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors 
// and https://github.com/mui/material-ui/issues/21250#issuecomment-1165363989
// createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

createRoot(document.getElementById('root')!).render(
    <App />
)

