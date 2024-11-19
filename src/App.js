import React, { useState } from 'react';
import ProductSelection from './ProductSelection';
import ARRProjections from './ARRProjections';
import calculateARRProjections from './calculateARRProjections';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('productSelection');
  const [appState, setAppState] = useState({
    selectedProducts: [],
    productFactors: {},
    servicePercentages: {},
    globalMargins: { productMargin: 0, serviceMargin: 0 },
    quarterlyData: {},
    calculatedData: {},
    arpu: {},
    professionalServices: {},
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const styles = {
    appContainer: {
      padding: '0',
      margin: '0',
      backgroundColor: '#1e1e1e',
      minHeight: '100vh',
      color: '#f1f1f1',
      fontFamily: 'Arial, sans-serif',
    },
    nav: {
      display: 'flex',
      backgroundColor: '#333',
      padding: '10px',
    },
    navButton: {
      backgroundColor: '#444',
      color: '#f1f1f1',
      border: 'none',
      padding: '10px 20px',
      marginRight: '10px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    activeNavButton: {
      backgroundColor: '#1e90ff',
    },
    tabContent: {
      padding: '20px',
    },
  };

  return (
    <div style={styles.appContainer}>
      <nav style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'productSelection' ? styles.activeNavButton : {}),
          }}
          onClick={() => handleTabChange('productSelection')}
        >
          Product Selection
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'arrProjections' ? styles.activeNavButton : {}),
          }}
          onClick={() => handleTabChange('arrProjections')}
          disabled={appState.selectedProducts.length === 0}
        >
          Quarterly ARR Projections
        </button>
      </nav>
      <div style={styles.tabContent}>
        {activeTab === 'productSelection' && (
          <ProductSelection appState={appState} setAppState={setAppState} />
        )}
        {activeTab === 'arrProjections' && (
          <ARRProjections appState={appState} setAppState={setAppState} />
        )}
      </div>
    </div>
  );
};

export default App;
