import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import './index.css'

const RootComponent = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page');

    if (page === 'privacy') return <PrivacyPolicy />;
    if (page === 'terms') return <TermsOfService />;

    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RootComponent />
    </React.StrictMode>,
)
