import React, { useState } from 'react';
import ProductSelection from './ProductSelection';
import ARRProjections from './ARRProjections';
import About from './About';
import './App.css';
import siemensLogo from './siemenslogo.png';

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
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState('about'); //default/starting tab
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

  //disclaimer closing
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);


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
      
      color: '#7d7ca1',
      border: 'none',
      padding: '10px 20px',
      marginRight: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s, color 0.3s',
    },
    navButtonHover:{
      color: '#ffffff',
      fontWeight: 'bold',
    },
    activeNavButton: {
      fontWeight: 'bold',
      color: '#ffffff',
      borderBottom: '2px solid #ffffff',
    },
    tabContent: {
      padding: '20px',
    },
    
  };

  return (
    <div style={styles.appContainer}>
      <div style={{ paddingBottom: '50px' }}>

      <nav style={styles.nav}>
        <span style={{marginLeft:'10px',marginRight:'20px',}}>
          <img
            src={siemensLogo}
            alt="PDF"
            style={{ width: '102px', height: '34px', marginBottom: '-5px' }}
          />
        </span>
        <span
          style={{
            ...styles.navButton,
            ...(activeTab === 'about' ? styles.activeNavButton : {}),
            ...(hoveredTab === 'about' ? styles.navButtonHover : {}),
          }}
          onClick={() => handleTabChange('about')}
          onMouseEnter={() => setHoveredTab('about')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          About
        </span>
        <span
          style={{
            ...styles.navButton,
            ...(activeTab === 'productSelection' ? styles.activeNavButton : {}),
            ...(hoveredTab === 'productSelection' ? styles.navButtonHover : {}),
          }}
          onClick={() => handleTabChange('productSelection')}
          onMouseEnter={() => setHoveredTab('productSelection')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          Product Selection
        </span>
        <span
          style={{
            ...styles.navButton,
            ...(activeTab === 'arrProjections' ? styles.activeNavButton : {}),
            ...(hoveredTab === 'arrProjections' ? styles.navButtonHover : {}),
          }}
          onClick={() => handleTabChange('arrProjections')}
          onMouseEnter={() => setHoveredTab('arrProjections')}
          onMouseLeave={() => setHoveredTab(null)}
          disabled={appState.selectedProducts.length === 0}
        >
          Quarterly ARR Projections
        </span>
      </nav>
      <div style={styles.tabContent}>
        {activeTab === 'about' && (
          <About />
        )}
        {activeTab === 'productSelection' && (
          <ProductSelection appState={appState} setAppState={setAppState} />
        )}
        {activeTab === 'arrProjections' && (
          <ARRProjections appState={appState} setAppState={setAppState} />
        )}
      </div>
        {/* Footer */}
        {!disclaimerAcknowledged && (
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
              zIndex: 1000, 
              boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ flex: 1, textAlign: 'center' }}>
              Disclaimer: This tool provides revenue projections solely as an indicative estimate based on simplified calculations. 
              Actual results may vary significantly due to numerous external and internal factors. 
              This document is not a guarantee of future performance. Siemens is not liable for any discrepancies or decisions made based on these projections.
            </span>
            <button
              onClick={() => setDisclaimerAcknowledged(true)}
              style={{
                marginLeft: '5px',
                marginRight: '25px',
                padding: '5px 10px',
                backgroundColor: '#1d1d2e',
                color: '#fff',
                border: '',
                cursor: 'pointer',
                fontSize: '12px',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#1976d1')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#1d1d2e')}
            >
              ✓ Acknowledge
            </button>
          </footer>
        )}
      </div>
    </div>
    );
  };

export default App;
