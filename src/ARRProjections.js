import React, { useState, useEffect } from 'react';
import calculateARRProjections from './calculateARRProjections';

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
  { label: 'Yearly Margin ARR', key: 'yearlyMarginARR' },
  { label: 'Progression of Total Margin ARR', key: 'progressionTotalMarginARR' },
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

  const [localQuarterlyData, setLocalQuarterlyData] = useState(initializeQuarterlyData);
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

  const handleInputChange = (quarter, field, product = null) => (event) => {
    let value = Number(event.target.value);

    // Ensure Expansion, Downgrade, and Churn values are limited between 0-100
    if ((field === 'expansion' || field === 'downgrade' || field === 'churn') && (value < 0 || value > 100)) {
      value = Math.max(0, Math.min(100, value));
    }

    setLocalQuarterlyData((prevData) => {
      const updatedData = {
        ...prevData,
        [quarter]: {
          ...prevData[quarter],
          ...(product
            ? { [product]: { ...prevData[quarter][product], [field]: value } }
            : { [field]: value }),
        },
      };
      setAppState((prevState) => ({
        ...prevState,
        quarterlyData: updatedData,
        calculatedData: calculateARRProjections({ ...prevState, quarterlyData: updatedData }),
      }));
      return updatedData;
    });
  };
  const handleFocus = (event) => {
    if (event.target.value === "0") {
      event.target.value = "";
    }
  };

  const handleBlur = (event) => {
    if (event.target.value === "") {
      event.target.value = "0";
    }
  };
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#1e1e1e',
      color: '#f1f1f1',
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
      backgroundColor: '#333',
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
      <table style={styles.table}>
        {/* Header Row for FY and Quarters */}
        <thead>
          <tr>
            <th style={styles.th}>ARR ($)</th>
            {quarters.map((quarter) => (
              <th style={styles.th} key={quarter}>{quarter}</th>
            ))}
          </tr>
        </thead>
        {/* Summary Margin ARR Section */}
        <tbody>
        {dataRows.map(({ label, key }) => (
          <tr key={key}>
            <td style={styles.td}>{label}</td>
            {quarters.map((quarter) => (
              <td style={styles.td} key={quarter}>
                {appState.calculatedData[quarter]?.[key] !== undefined
                  ? appState.calculatedData[quarter][key].toFixed(2)  // Format to two decimal places
                  : '-'}
              </td>
            ))}
          </tr> ))}

        </tbody>

        {/* Inputs Section */}
        <thead>
          <tr>
            <th style={styles.th}>Inputs</th>
            {quarters.map((quarter) => (
              <th style={styles.th} key={quarter}>{quarter}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* ARPU and Professional Services per Product */}
          {products.map((product) => (
            <React.Fragment key={product}>
              <tr>
                <td style={styles.td}>ARPU (Quarter) - {product}</td>
                {quarters.map((quarter) => (
                  <td style={styles.td} key={quarter}>
                    {(appState.arpu[product] || 0).toFixed(2)} {/* Format to two decimal places */}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={styles.td}>Professional Services (Quarter) per deal - {product}</td>
                {quarters.map((quarter) => (
                  <td style={styles.td} key={quarter}>
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
              {quarters.map((quarter) => (
                <td style={styles.td} key={quarter}>
                  <input
                    type="number"
                    value={localQuarterlyData[quarter]?.[product]?.newDeals || 0}
                    onChange={handleInputChange(quarter, 'newDeals', product)}
                    style={styles.input}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    min="0"
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Expansion, Downgrade, and Churn % Inputs */}
          {['expansion', 'downgrade', 'churn'].map((field) => (
            <tr key={field}>
              <td style={styles.td}>{`${field.charAt(0).toUpperCase() + field.slice(1)} %`}</td>
              {quarters.map((quarter) => (
                <td style={styles.td} key={quarter}>
                  <input
                    type="number"
                    value={localQuarterlyData[quarter]?.[field] || 0}
                    onChange={handleInputChange(quarter, field)}
                    style={styles.input}
                    min="0"
                    max="100"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  %
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ARRProjections;
