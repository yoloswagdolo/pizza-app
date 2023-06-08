import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import RouteComponent from '../components/RouteComponent';
import { BrowserRouter } from "react-router-dom";
import './App.css';

function App() {
  return (
    <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
        <BrowserRouter>
          <RouteComponent />
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
