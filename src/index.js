import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/main.scss';
import MDWA from './components/MDWA';

// react-scripts does not emit service-worker.js. Registering the missing
// file 404s, and the old localhost check then reloads the page in a loop.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<MDWA />);
