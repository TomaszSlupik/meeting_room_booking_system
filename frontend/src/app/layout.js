"use client"; 
import "./styles/globals.css";
import { Provider } from "react-redux";
import { store } from '../app/redux/store/index';
import { ThemeProvider } from '@mui/material';
import theme from './theme/theme'


export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
            <ThemeProvider
            theme={theme}
            > 
                    <Provider store={store}>
                      {children}
                    </Provider>
            </ThemeProvider>
      </body>
    </html>
  );
}
