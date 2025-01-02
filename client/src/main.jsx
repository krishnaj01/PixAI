import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './contexts/UserContext/UserContextProvider.jsx'
import LoginContextProvider from './contexts/LoginContext/LoginContextProvider.jsx'
import AppContextProvider from './contexts/AppContext/AppContextProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <AppContextProvider>
        <LoginContextProvider>
          <App />
        </LoginContextProvider>
      </AppContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);