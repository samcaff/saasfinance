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
      transition: 'background-color 0.3s, color 0.3s',
    },
    activeNavButton: {
      backgroundColor: '#155959',
      color: '#ffffff'
    },
    navButtonHover: {
      backgroundColor: '#2ab0b0',
    },
    tabContent: {
      padding: '20px',
    },
    
  };

  return (
    <div style={styles.appContainer}>
      <div style={{ paddingBottom: '50px' }}>
      
      <nav style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'productSelection' ? styles.activeNavButton : {}),
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2ab0b0')}
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor =
              activeTab === 'productSelection' ? '#155959' : '#30CBCB')
          }
          onClick={() => handleTabChange('productSelection')}
        >
          Product Selection
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'arrProjections' ? styles.activeNavButton : {}),
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2ab0b0')}
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor =
              activeTab === 'arrProjections' ? '#155959' : '#30CBCB')
          }
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
        {/* Footer */}
          <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#16152E',
            color: '#f1f1f1',
            textAlign: 'center',
            padding: '10px 20px',
            fontSize: '12px',
            zIndex: 1000, // Ensures it stays on top of other elements
            boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)', // Optional: Adds a subtle shadow for separation
          }}
        >
          Disclaimer: This tool provides revenue projections solely as an indicative estimate based on simplified calculations. 
          Actual results may vary significantly due to numerous external and internal factors. 
          This document is not a guarantee of future performance. Siemens is not liable for any discrepancies or decisions made based on these projections.
        </footer>
      </div>
    </div>
    );
  };

export default App;
