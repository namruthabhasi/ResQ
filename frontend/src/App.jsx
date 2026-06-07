import React, { useState } from 'react';
import Layout from './components/Layout';
import HeroLanding from './components/HeroLanding';
import EmergencyMode from './components/EmergencyMode';
import AIAssistant from './components/AIAssistant';
import SurvivalToolkit from './components/SurvivalToolkit';
import ContactsPage from './components/ContactsPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [disasterSearchQuery, setDisasterSearchQuery] = useState("");

  const clearInitialSearchQuery = () => {
    setDisasterSearchQuery("");
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'landing':
        return (
          <HeroLanding
            setActivePage={setActivePage}
            setDisasterSearchQuery={setDisasterSearchQuery}
          />
        );
      case 'emergency':
        return <EmergencyMode />;
      case 'chat':
        return (
          <AIAssistant
            initialSearchQuery={disasterSearchQuery}
            clearInitialSearchQuery={clearInitialSearchQuery}
          />
        );
      case 'toolkit':
        return <SurvivalToolkit />;
      case 'contacts':
        return <ContactsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <HeroLanding
            setActivePage={setActivePage}
            setDisasterSearchQuery={setDisasterSearchQuery}
          />
        );
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderActiveView()}
    </Layout>
  );
}
