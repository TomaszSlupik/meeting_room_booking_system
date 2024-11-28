"use client"; 
import "./styles/globals.css";
import { Provider } from "react-redux";
import { store } from '../app/redux/store/index';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
