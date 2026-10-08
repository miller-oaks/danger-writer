import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/main.scss';
import MDWA from './components/MDWA';
import registerServiceWorker from './registerServiceWorker';

// The production build writes service-worker.js. Registration no longer
// reloads when the file is missing, which is what the dev server does.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<MDWA />);
registerServiceWorker();
