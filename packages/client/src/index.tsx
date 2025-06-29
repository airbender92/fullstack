import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import RootStore from './stores/RootStore';
import { StoreProvider } from './stores/useStore';

const rootStore = new RootStore();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);