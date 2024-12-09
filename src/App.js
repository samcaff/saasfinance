import React, { useState } from 'react';
import ProductSelection from './ProductSelection';
import ARRProjections from './ARRProjections';
import calculateARRProjections from './calculateARRProjections';
import './App.css';

const App = () => {
  const initializeQuarterlyData = () => {
    const initialData = {};
    const quarters = [
      'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025',
      'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026',
      'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027',
      'Q1 2028', 'Q2 2028', 'Q3 2028', 'Q4 2028',
    ];
    quarters.forEach((quarter) => {
      initialData[quarter] = {
        expansion: 0,
        downgrade: 0,
        churn: 0,
      };
    });
    return initialData;
  };
  const [activeTab, setActiveTab] = useState('productSelection');
  const [appState, setAppState] = useState({
    selectedProducts: [],
    productFactors: {},
    servicePercentages: {},
    globalMargins: { productMargin: 0, serviceMargin: 0 },
    quarterlyData: {},
    localQuarterlyData: initializeQuarterlyData(),
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
      backgroundColor: '#020027',
      minHeight: '100vh',
      color: '#f1f1f1',
      fontFamily: 'Arial, sans-serif',
    },
    nav: {
      display: 'flex',
      backgroundColor: '#24233C',
      padding: '10px',
    },
    navButton: {
      backgroundColor: '#30CBCB',
      color: '#020027',
      border: 'none',
      padding: '10px 20px',
      marginRight: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      borderRadius: '5px',
    },
    activeNavButton: {
      backgroundColor: '#34FFBA',
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
