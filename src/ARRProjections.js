import React, { useState, useEffect } from 'react';
import calculateARRProjections from './calculateARRProjections';
import { TextField } from '@mui/material';

const dataRows = [
  { label: 'Beginning Margin ARR', key: 'beginningMarginARR' },
  { label: 'New ARR Margin Licenses', key: 'newArrMarginLicenses' },
  { label: 'New ARR Margin Services', key: 'newArrMarginServices' },
  { label: 'New ARR Margin Total', key: 'newArrMarginTotal' },
  { label: 'Expansion ARR', key: 'expansionARR' },
  { label: 'Downgrade ARR', key: 'downgradeARR' },
  { label: 'Churn', key: 'churnARR' },
  { label: 'Quarterly Margin ARR TOTAL', key: 'quarterlyMarginARRTotal' },
  { label: 'Ending Margin ARR', key: 'endingMarginARR' },
];

const ARRProjections = ({ appState, setAppState }) => {
  const products = appState.selectedProducts;
  const quarters = [
    'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025',
    'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026',
    'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027',
    'Q1 2028', 'Q2 2028', 'Q3 2028', 'Q4 2028',
  ];

  const initializeQuarterlyData = () => {
    const initialData = {};
    quarters.forEach((quarter) => {
      initialData[quarter] = initialData[quarter] || {};
      products.forEach((product) => {
        initialData[quarter][product] = initialData[quarter][product] || { newDeals: 0 };
      });
      initialData[quarter].expansion = initialData[quarter].expansion ?? 0;
      initialData[quarter].downgrade = initialData[quarter].downgrade ?? 0;
      initialData[quarter].churn = initialData[quarter].churn ?? 0;
    });
    return initialData;
  };

  const [calculatedData, setCalculatedData] = useState({});

  useEffect(() => {
    const newCalculatedData = calculateARRProjections(appState);
    setAppState((prevState) => ({
      ...prevState,
      calculatedData: newCalculatedData,
    }));
  }, [
    appState.quarterlyData, 
    appState.selectedProducts,
    appState.globalMargins,
    appState.globalMargins,
    appState.arpu,
    appState.professionalServices,
    setAppState
  ]);

  useEffect(() => {
    const updatedData = { ...appState.localQuarterlyData };
    const quarters = Object.keys(updatedData);
  
    // Ensure every selected product has a data entry in every quarter
    quarters.forEach((quarter) => {
      appState.selectedProducts.forEach((product) => {
        if (!updatedData[quarter][product]) {
          updatedData[quarter][product] = { newDeals: 0 }; // Initialize missing product data
        }
      });
    });
  
    // Update localQuarterlyData in appState
    setAppState((prevState) => ({
      ...prevState,
      localQuarterlyData: updatedData,
    }));
  }, [appState.selectedProducts, setAppState]);
  

  const handleInputChange = (quarter, field, product = null) => (event) => {
  let value = Number(event.target.value);

  // Ensure Expansion, Downgrade, and Churn values are limited between 0-100
  if ((field === 'expansion' || field === 'downgrade' || field === 'churn') && (value < 0 || value > 100)) {
    value = Math.max(0, Math.min(100, value));
  }

  setAppState((prevState) => {
    const updatedData = {
      ...prevState.localQuarterlyData,
      [quarter]: {
        ...prevState.localQuarterlyData[quarter],
        ...(product
          ? { [product]: { ...prevState.localQuarterlyData[quarter][product], [field]: value } }
          : { [field]: value }),
      },
    };

      return {
        ...prevState,
        localQuarterlyData: updatedData,
        quarterlyData: updatedData, // Sync for calculations
        calculatedData: calculateARRProjections({
          ...prevState,
          quarterlyData: updatedData,
        }),
      };
    });
  };


  const handleFocus = (event) => {
    if (event.target.value === "0") {
      const name = event.target.getAttribute("name"); // Identify field
      setAppState((prevState) => {
        const updatedData = { ...prevState.localQuarterlyData };
        // Set the field value to an empty string in appState
        updatedData[name] = "";
        return { ...prevState, localQuarterlyData: updatedData };
      });
    }
  };

  const handleBlur = (event) => {
    if (event.target.value === "") {
      const name = event.target.getAttribute("name"); // Identify field
      setAppState((prevState) => {
        const updatedData = { ...prevState.localQuarterlyData };
        // Reset field value in appState
        updatedData[name] = 0;
        return { ...prevState, localQuarterlyData: updatedData };
      });
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const styles = {
    responsiveContainer: {
      maxHeight: '80vh', // Restrict table height to 80% of the viewport height
      overflow: 'auto', // Enable scrolling for overflow content
      border: '1px solid #555', // Optional: Add a border for visibility
      borderRadius: '8px',
      backgroundColor: '#16152E', // Match table color
      padding: '10px',
    },
    container: {
      padding: '20px',
      backgroundColor: '#16152e',
      color: '#f1f1f1',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      fontSize: '12px',
    },
    th: {
      border: '1px solid #555',
      padding: '8px',
      backgroundColor: '#24233C',
      whiteSpace: 'nowrap',
    },
    td: {
      border: '1px solid #555',
      padding: '8px',
      textAlign: 'center',
    },
    input: {
      width: '80px',
      padding: '5px',
      borderRadius: '3px',
      border: '1px solid #555',
      backgroundColor: '#222',
      color: '#f1f1f1',
      textAlign: 'center',
      outline: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.responsiveContainer}>
        <table style={styles.table}>
          {/* Header Row for FY and Quarters */}
          <thead>
            <tr>
              <th style={styles.th}>ARR ($)</th>
              {quarters.map((quarter, index) => (
                <th style={{
                  ...styles.th,
                  borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                  borderLeft: index===0 ? '4px double #999' : 'none',
                }} key={quarter}>{quarter}</th>
              ))}
            </tr>
          </thead>
          {/* Summary Margin ARR Section */}
          <tbody>
          {dataRows.map(({ label, key }) => (
            <tr key={key}>
              <td style={styles.td}>{label}</td>
              {quarters.map((quarter, index) => (
                <td style={{
                  ...styles.td,
                  borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                  borderLeft: index===0 ? '4px double #999' : 'none',
                  }} key={quarter}>
                  {appState.calculatedData[quarter]?.[key] !== undefined
                    ? formatCurrency(appState.calculatedData[quarter][key])
                    : '-'}
                </td>
              ))}
            </tr> ))}
            <tr>
              <td style={styles.td}>Progression of Total Margin ARR</td>
              {quarters.map((quarter,index) => (
                <td style={{
                  ...styles.td,
                  borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                  borderLeft: index===0 ? '4px double #999' : 'none',
                }} key={quarter}>
                  {appState.calculatedData[quarter]?.progressionTotalMarginARR !== undefined
                    ? formatCurrency(appState.calculatedData[quarter].progressionTotalMarginARR)
                    : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={styles.td}>Yearly Margin ARR</td>
              {quarters.map((quarter, index) => (
                <td style={{
                  ...styles.td,
                  borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                  borderLeft: index===0 ? '4px double #999' : 'none',
                }} key={quarter}>
                  {index % 4 === 3
                    ? formatCurrency(appState.calculatedData[`FY ${2025 + Math.floor(index / 4)}`]?.yearlyMarginARR)
                    : ''}
                </td>
              ))}
            </tr>
          </tbody>

          {/* Inputs Section */}
          <thead>
            <tr>
              <th style={styles.th}>Inputs</th>
              {quarters.map((quarter,index) => (
                <th style={{
                  ...styles.th,
                  borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                  borderLeft: index===0 ? '4px double #999' : 'none',
                }} key={quarter}>{quarter}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ARPU and Professional Services per Product */}
            {products.map((product) => (
              <React.Fragment key={product}>
                <tr>
                  <td style={styles.td}>ARPU (Quarter) - {product}</td>
                  {quarters.map((quarter,index) => (
                    <td style={{
                      ...styles.td,
                      borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                      borderLeft: index===0 ? '4px double #999' : 'none',
                    }} key={quarter}>
                      {(appState.arpu[product] || 0).toFixed(2)} {/* Format to two decimal places */}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={styles.td}>Professional Services (Quarter) per deal - {product}</td>
                  {quarters.map((quarter,index) => (
                    <td style={{
                      ...styles.td,
                      borderRight: (index+1)%4 === 0 && (index+1)!=16 ? '4px double #999' : '1px solid #555',
                      borderLeft: index===0 ? '4px double #999' : 'none',
                    }} key={quarter}>
                      {(appState.professionalServices[product] || 0).toFixed(2)} {/* Format to two decimal places */}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}

            {/* New Deals per Quarter Inputs */}
            {products.map((product) => (
              <tr key={`new-deals-${product}`}>
                <td style={styles.td}>New Deals per quarter (#) - {product}</td>
                {quarters.map((quarter, index) => (
                  <td
                    style={{
                      ...styles.td,
                      borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #555',
                      borderLeft: index === 0 ? '4px double #999' : 'none',
                    }}
                    key={quarter}
                  >
                    <TextField
                      
                      type="number"
                      value={appState.localQuarterlyData[quarter]?.[product]?.newDeals || 0}
                      onChange={handleInputChange(quarter, 'newDeals', product)}
                      variant="standard"
                      inputProps={{
                        min: 0,
                        style: { textAlign: 'center'},
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#24233C',
                          color: '#f1f1f1',
                          borderRadius: '4px',
                        },
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid #555',
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                          borderBottom: '1px solid #777',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '2px solid #1e90ff',
                        },
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}

            {/* Expansion, Downgrade, and Churn % Inputs */}
            {['expansion', 'downgrade', 'churn'].map((field) => (
              <tr key={field}>
                <td style={styles.td}>{`${field.charAt(0).toUpperCase() + field.slice(1)} %`}</td>
                {quarters.map((quarter, index) => (
                  <td
                    style={{
                      ...styles.td,
                      borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #555',
                      borderLeft: index === 0 ? '4px double #999' : 'none',
                    }}
                    key={quarter}
                  >
                    <TextField
                      type="number"
                      value={appState.localQuarterlyData[quarter]?.[field] || 0}
                      onChange={handleInputChange(quarter, field)}
                      variant="standard"
                      inputProps={{
                        min: 0,
                        max: 100,
                        style: { textAlign: 'center'},
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#24233C',
                          color: '#f1f1f1',
                          borderRadius: '4px',
                        },
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid #555',
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                          borderBottom: '1px solid #777',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '2px solid #1e90ff',
                        },
                      }}
                    />
                    %
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ARRProjections;
