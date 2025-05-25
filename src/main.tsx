import { createTheme, ThemeProvider } from '@mui/material';
import { configureStore } from 'application/0-store/store';
import services from 'infrastructure/services';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './views';

interface ExtendedTypographyOptions
  extends Record<string, React.CSSProperties> {}

const theme = createTheme({
  palette: {
    primary: { main: '#52a2aa' },
  },
  typography: {
    lato: {
      color: '#555',
      fontFamily: 'Lato, sans-serif',
      fontWeight: 400,
    },
    lato100: {
      color: '#555',
      fontFamily: 'Lato, sans-serif',
      fontWeight: 100,
    },
    lato700: {
      color: '#555',
      fontFamily: 'Lato, sans-serif',
      fontWeight: 700,
    },
    lato900: {
      color: '#555',
      fontFamily: '"Lato',
      fontWeight: 900,
    },
    notoSerifJP: {
      color: '#555',
      fontFamily: '"Noto Serif JP", serif',
      fontWeight: 400,
    },
    notoSerifJP300: {
      color: '#555',
      fontFamily: '"Noto Serif JP", serif',
      fontWeight: 300,
    },
    mPlusRounded: {
      color: '#555',
      fontFamily: '"M PLUS Rounded 1c", sans-serif',
      fontWeight: 400,
    },
    mPlusRounded300: {
      color: '#555',
      fontFamily: '"M PLUS Rounded 1c", sans-serif',
      fontWeight: 300,
    },
    mPlusRounded500: {
      color: '#555',
      fontFamily: '"M PLUS Rounded 1c", sans-serif',
      fontWeight: 500,
    },
  } as any,
});

if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

const store = configureStore(services);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = typeof store.dispatch;
