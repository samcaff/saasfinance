import React, { useState, useEffect } from 'react';
import calculateARRProjections from './calculateARRProjections';
import { TextField } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import excelIcon from './Microsoft_Office_Excel_Logo_512px.png';
import pdfIcon from './png-transparent-pdf-icon-thumbnail.png'; 

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
const dataRowsRevenue = [
  { label: 'Beginning ARR Revenue', key: 'beginningRevenueARR' },
  { label: 'Quarterly ARR Revenue (Licenses)', key: 'quarterlyRevenueLicenses' },
  { label: 'Quarterly ARR Revenue (Services)', key: 'quarterlyRevenueServices' },
  { label: 'New ARR Revenue Total', key: 'newRevenueTotal' },
  { label: 'Expansion ARR', key: 'expansionRevenueARR' },
  { label: 'Downgrade ARR', key: 'downgradeRevenueARR' },
  { label: 'Churn ARR', key: 'churnRevenueARR' },
  { label: 'Quarterly Revenue ARR TOTAL', key: 'quarterlyRevenueARRTotal' },
  { label: 'Ending Revenue ARR', key: 'endingRevenueARR' },
  { label: 'Progression of Total Revenue ARR', key: 'progressionTotalRevenueARR'},
];

const ARRProjections = ({ appState, setAppState }) => {
  const products = appState.selectedProducts;
  const quarters = [
    'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025',
    'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026',
    'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027',
    'Q1 2028', 'Q2 2028', 'Q3 2028', 'Q4 2028',
  ];

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
  
    // Ensure every selected product has valid data
    quarters.forEach((quarter) => {
      appState.selectedProducts.forEach((product) => {
        updatedData[quarter] = updatedData[quarter] || {};
        if (!updatedData[quarter][product]) {
          updatedData[quarter][product] = { newDeals: 0 };
        }
      });
    });
  
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
    if (event.target.value === "0" || event.target.value === 0) {
      event.target.select(); // Highlights the entire value
    }
  };

  const handleBlur = (event) => {
    if (event.target.value === "") {
      event.target.value = "0"; // Reset to 0
      handleInputChange(
        event.target.getAttribute("data-quarter"),
        event.target.getAttribute("data-field")
      )({ target: { value: 0 } });
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  //  Excel export option
  const exportToExcel = () => {
    const tableData = [];
    
    // Add headers
    const headerRow = ['ARR ($)', ...quarters];
    tableData.push(headerRow);
  
    // Add calculated data rows
    dataRows.forEach(({ label, key }) => {
      const row = [label];
      quarters.forEach((quarter) => {
        row.push(appState.calculatedData[quarter]?.[key] || '-');
      });
      tableData.push(row);
    });
  
    // Add progression of total margin ARR
    const progressionRow = ['Progression of Total Margin ARR'];
    quarters.forEach((quarter) => {
      progressionRow.push(
        appState.calculatedData[quarter]?.progressionTotalMarginARR || '-'
      );
    });
    tableData.push(progressionRow);
  
    // Add yearly margin ARR
    const yearlyRow = ['Yearly Margin ARR'];
    quarters.forEach((quarter, index) => {
      if (index % 4 === 3) {
        yearlyRow.push(
          appState.calculatedData[`FY ${2025 + Math.floor(index / 4)}`]
            ?.yearlyMarginARR || '-'
        );
      } else {
        yearlyRow.push('');
      }
    });
    tableData.push(yearlyRow);

    // Create the worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quarterly ARR Projections');
  
    // Export to Excel
    XLSX.writeFile(workbook, 'Quarterly_ARR_Projections.xlsx');
  };

    //export button dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  //export as PDF logic
  const exportToPDF = () => {
    const tableElement = document.querySelector('table'); // Target the table directly
  
    html2canvas(tableElement, {
      scale: 1, // Adjust for more compact rendering while maintaining quality
      useCORS: true, // Handle cross-origin images
      scrollX: 0, // Reset horizontal scroll
      scrollY: 0, // Reset vertical scroll
      height: tableElement.scrollHeight, // Capture the full height
      windowHeight: tableElement.scrollHeight, // Ensures full content is rendered
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
  
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('Quarterly_ARR_Projections.pdf');

    });
  };

  const styles = {
    responsiveContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'space-between',
      maxHeight: '80vh', 
      width: '100%', 
      border: '1px solid #555',
      borderRadius: '8px',
      backgroundColor: '#16152E',
      padding: '10px',
      overflowX: 'auto',
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
      backgroundColor: '#16152E',
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
    <div id="arr-projections-container" style={styles.container}>
      <div style={styles.container}>
      <h2 style={{marginTop: '-15px'}}>Quarterly ARR Projections</h2>
      <h4 style={{marginTop: '-5px'}}>Input fields at the bottom of the table</h4>
        <div style={styles.responsiveContainer}>
          <table style={styles.table}>
            {/* Header Row for FY and Quarters */}
            <thead>
              <tr>
                <td colSpan={quarters.length + 1} style={{...styles.td, backgroundColor: '#24233C', color: '#fff' }}>Summary Margin ARR</td>
              </tr>
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
                <td style={{...styles.td,backgroundColor:'#333C57'}}>Yearly Margin ARR</td>
                  {quarters.map((quarter, index) => (
                    <td
                      style={{
                        ...styles.td,
                        backgroundColor:'#333C57', 
                        borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #333C57',
                        borderLeft: index === 0 ? '4px double #999' : 'none',
                      }}
                      key={quarter}
                    >
                      {index % 4 === 3
                        ? formatCurrency(appState.calculatedData[`FY ${2025 + Math.floor(index / 4)}`]?.yearlyMarginARR)
                        : ''}
                    </td>
                  ))}
              </tr>
            </tbody>
            <tbody>
              <tr>
                  <td colSpan={quarters.length + 1} style={{...styles.td, backgroundColor: '#24233C', color: '#fff' }}>Summary Revenue ARR</td>
                </tr>
                {dataRowsRevenue.map(({ label, key }) => (
                    <tr key={key}>
                        <td style={{...styles.td,backgroundColor:'#100f30',}}>{label}</td>
                        {quarters.map((quarter, index) => (
                            <td
                                key={quarter}
                                style={{
                                    ...styles.td, backgroundColor:'#100f30',
                                    borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #555',
                                    borderLeft: index === 0 ? '4px double #999' : 'none',
                                }}
                            >
                                {appState.calculatedData[quarter]?.[key] !== undefined
                                    ? formatCurrency(appState.calculatedData[quarter][key])
                                    : '-'}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr>
                <td style={{ ...styles.td, backgroundColor: '#333C57' }}>Yearly Revenue ARR</td>
                {quarters.map((quarter, index) => (
                  <td
                    style={{
                      ...styles.td,
                      backgroundColor: '#333C57',
                      borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #333C57',
                      borderLeft: index === 0 ? '4px double #999' : 'none',
                    }}
                    key={quarter}
                  >
                    {index % 4 === 3
                      ? formatCurrency(appState.calculatedData[`FY ${2025 + Math.floor(index / 4)}`]?.yearlyRevenueARR)
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
                      {formatCurrency(appState.arpu[product])}                      </td>
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
                        {formatCurrency(appState.professionalServices[product])} 
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}

              {/* New Deals per Quarter Inputs */}
              {products.map((product) => (
                <tr key={`new-deals-${product}`}>
                  <td style={{...styles.td,backgroundColor:'#246A73'}}>New Deals per quarter (#) - {product}</td>
                  {quarters.map((quarter, index) => (
                    <td
                      style={{
                        ...styles.td,
                        backgroundColor:'#246A73',
                        borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #555',
                        borderLeft: index === 0 ? '4px double #999' : 'none',
                      }}
                      key={quarter}
                    >
                      <TextField
                        type="number"
                        value={appState.localQuarterlyData[quarter]?.[product]?.newDeals || 0}
                        onChange={handleInputChange(quarter, 'newDeals', product)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        variant="standard"
                        inputProps={{
                          min: 0,
                          style: { textAlign: 'center' },
                        }}
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
                  <td style={{...styles.td,backgroundColor:'#368F8B'}}>{`${field.charAt(0).toUpperCase() + field.slice(1)} %`}</td>
                  {quarters.map((quarter, index) => (
                    <td
                      style={{
                        ...styles.td,
                        backgroundColor:'#368F8B',
                        borderRight: (index + 1) % 4 === 0 && (index + 1) !== 16 ? '4px double #999' : '1px solid #555',
                        borderLeft: index === 0 ? '4px double #999' : 'none',
                      }}
                      key={quarter}
                    >
                      <TextField
                        type="number"
                        value={appState.localQuarterlyData[quarter]?.[field] || 0}
                        onChange={handleInputChange(quarter, field)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        variant="standard"
                        inputProps={{
                          min: 0,
                          max: 100,
                          style: { textAlign: 'center' },
                        }}
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
        {/* Export Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleDropdown}
              style={{
                marginTop: '20px',
                backgroundColor: '#41B683',
                color: '#fff',
                border: 'none',
                padding: '10px 30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2f825e')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#41B683')}
            >
              Export
              <span style={{ marginLeft: '10px'}}>▼</span>
            </button>
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#333C57',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={exportToExcel}
                  style={{
                    backgroundColor: '#333C57',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#2f825e')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#333C57')}
                >
                  to Excel
                  <span style={{ marginLeft: '10px' }}>
                    <img
                      src={excelIcon}
                      alt="Excel"
                      style={{ width: '16px', height: '16px', marginBottom: '-3px' }}
                    />
                  </span>
                </button>
                <button
                  onClick={exportToPDF}
                  style={{
                    backgroundColor: '#333C57',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#2f825e')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#333C57')}
                >
                  to PDF
                  <span style={{ marginLeft: '8px' }}>
                    <img
                      src={pdfIcon}
                      alt="PDF"
                      style={{ width: '22px', height: '18px', marginBottom: '-5px' }}
                    />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARRProjections;
