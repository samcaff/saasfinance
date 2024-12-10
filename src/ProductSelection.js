import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,

} from 'recharts';
import { Checkbox, FormControlLabel } from '@mui/material';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';



const productDetails = {
  "Teamcenter": { salesCycle: "8-12 months", licenseSize: 140000,
      serviceFactors: [0.2, 0.7, 0.7, 0.04, 0.4, 0.08, 0.05, 0.5, 0] },
  "NX": { salesCycle: "2-4 months", licenseSize: 150000, 
      serviceFactors: [0.2, 0.5, 0.5, 0.04, 0.4, 0.02, 0.05, 0.2, 0] },
  "Solid Edge": { salesCycle: "3-6 months", licenseSize: 65000, 
      serviceFactors: [0.2, 0.5, 0.5, 0.04, 0.4, 0.02, 0.05, 0.2, 0] },
  "Simcenter": { salesCycle: "2-4 months", licenseSize: 50000, 
      serviceFactors: [0.2, 0.5, 0.5, 0.04, 0.7, 0.1, 0.1, 0.2, 0] },
  "STAR CCM": { salesCycle: "4-8 months", licenseSize: 50000, 
      serviceFactors: [0.2, 0.5, 0.5, 0.04, 0.7, 0.1, 0.1, 0.2, 0] },
  "Opcenter Execution": { salesCycle: "4-8 months", licenseSize: 60000,
      serviceFactors: [0.4, 0.7, 0.7, 0.04, 0.7, 0.2, 0.1, 0.5, 0] },
  "Opcenter APS": { salesCycle: "2-3 months", licenseSize: 50000, 
      serviceFactors: [0.4, 0.7, 0.7, 0.04, 0.7, 0.2, 0.1, 0.5, 0] },
  "Opcenter Intelligence": { salesCycle: "4-8 months", licenseSize: 60000,
      serviceFactors: [0.4, 0.7, 0.7, 0.04, 0.7, 0.2, 0.1, 0.5, 0] },
  "Opcenter Quality": { salesCycle: "2-3 months", licenseSize: 25000,
      serviceFactors: [0.4, 0.7, 0.7, 0.04, 0.7, 0.2, 0.1, 0.5, 0] },
  "Teamcenter X": { salesCycle: "3-6 months", licenseSize: 140000,
      serviceFactors: [0, 0, 0.5, 0.04, 0.4, 0.08, 0.02, 0.2, 0] },
  "NX X": { salesCycle: "3-6 months", licenseSize: 150000, 
      serviceFactors: [0, 0, 0.3, 0.04, 0.4, 0.02, 0.05, 0.5, 0] },
  "Polarion X": { salesCycle: "3-6 months", licenseSize: 25000,
      serviceFactors: [0, 0, 0.1, 0.04, 0.7, 0.08, 0.05, 0.5, 0] },
  "Opcenter X": { salesCycle: "3-6 months", licenseSize: 60000,
      serviceFactors: [0.4, 0.7, 0.7, 0.04, 0.7, 0.2, 0.1, 0.5, 0] }
};


const ProductSelection = ({ appState, setAppState }) => {
  const products = Object.keys(productDetails);
  const factors = [
    "Software Apps & Add-Ons", "Custom Apps", "Systems Integration & Process Automation", "Product Content",
    "CORE Consulting", "Custom Workflows", "Enhanced Support & Training", "Product & Data Configuration", "Scaled Product Rollout"
  ];

  const [selectedProduct1, setSelectedProduct1] = useState("None");
  const [selectedProduct2, setSelectedProduct2] = useState("None");
  const [selectedProduct3, setSelectedProduct3] = useState("None");

  // Synchronize local selected products with appState
  useEffect(() => {
    const selectedProducts = appState.selectedProducts;
    setSelectedProduct1(selectedProducts[0] || "None");
    setSelectedProduct2(selectedProducts[1] || "None");
    setSelectedProduct3(selectedProducts[2] || "None");
  }, [appState.selectedProducts]);

  const handleSelectChange = (setSelectedProduct, index) => (event) => {
    const selectedProduct = event.target.value;
    setSelectedProduct(selectedProduct);

    setAppState((prevState) => {
        let newSelectedProducts = [...prevState.selectedProducts];
        let newProductFactors = { ...prevState.productFactors };
        let newServicePercentages = { ...prevState.servicePercentages };
        let newLocalQuarterlyData = { ...prevState.localQuarterlyData };


        if (selectedProduct && selectedProduct !== "None") {
          newSelectedProducts[index] = selectedProduct;
    
          // Ensure selected product has valid quarterly data
          Object.keys(newLocalQuarterlyData).forEach((quarter) => {
            newLocalQuarterlyData[quarter] = newLocalQuarterlyData[quarter] || {};
            if (!newLocalQuarterlyData[quarter][selectedProduct]) {
              newLocalQuarterlyData[quarter][selectedProduct] = { newDeals: 0 };
            }
          });
    
          if (!newProductFactors[selectedProduct]) {
            newProductFactors[selectedProduct] = {};
          }
          if (!newServicePercentages[selectedProduct]) {
            newServicePercentages[selectedProduct] = 0;
          }
        } else {
          const deselectedProduct = newSelectedProducts[index];
          newSelectedProducts[index] = null;
    
          // Remove quarterly data for deselected product
          if (deselectedProduct) {
            Object.keys(newLocalQuarterlyData).forEach((quarter) => {
              delete newLocalQuarterlyData[quarter][deselectedProduct];
            });
            delete newProductFactors[deselectedProduct];
            delete newServicePercentages[deselectedProduct];
          }
        }
        


        newSelectedProducts = newSelectedProducts.filter(Boolean);
    
        return {
          ...prevState,
          selectedProducts: newSelectedProducts,
          productFactors: newProductFactors,
          servicePercentages: newServicePercentages,
          localQuarterlyData: newLocalQuarterlyData,
        };
    });
  };

  const handleFactorChange = (product, factorIndex) => (event) => {
    const isSelected = event.target.checked;
    setAppState((prevState) => {
        const newProductFactors = {
        ...prevState.productFactors,
        [product]: {
            ...prevState.productFactors[product],
            [factorIndex]: isSelected,
        },
        };
    
        const serviceFactorArray = productDetails[product].serviceFactors;
        const newTotal = Object.entries(newProductFactors[product])
        .filter(([, selected]) => selected)
        .reduce((total, [index]) => total + serviceFactorArray[index], 0);
    
        const newServicePercentages = {
        ...prevState.servicePercentages,
        [product]: newTotal,
        };
    
        return {
        ...prevState,
        productFactors: newProductFactors,
        servicePercentages: newServicePercentages,
        };
    });
  
  };

  const handleGlobalMarginChange = (marginType) => (event) => {
    let value = Math.max(0, Math.min(100, Number(event.target.value)));

    setAppState((prevState) => ({
      ...prevState,
      globalMargins: {
        ...prevState.globalMargins,
        [marginType]: value,
      },
    }));
  };

  const formatNumber = (number) => {
    if (isNaN(number)) return '-';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
  };

  useEffect(() => {
    const arpuData = {};
    const profServicesData = {};

    appState.selectedProducts.forEach((product) => {
      const productData = productDetails[product];
      const totalServicePercentage = appState.servicePercentages[product] || 0;
      const avgLicenseSize = productData.licenseSize;
      const avgServiceSize = avgLicenseSize * totalServicePercentage;

      arpuData[product] = avgLicenseSize * (3 / 36);
      profServicesData[product] = avgServiceSize * (3 / 36);
    });

    // Update ARPU and Professional Services data in appState
    setAppState((prevState) => ({
      ...prevState,
      arpu: arpuData,
      professionalServices: profServicesData,
    }));
  }, [appState.selectedProducts, appState.globalMargins, appState.servicePercentages]);


  const calculateProductData = (product) => {
    const productData = productDetails[product];
    const totalServicePercentage = appState.servicePercentages[product] || 0;
    const avgLicenseSize = productData.licenseSize;
    const avgServiceSize = avgLicenseSize * totalServicePercentage;

    const licenseMargin = avgLicenseSize * (appState.globalMargins.productMargin / 100);
    const serviceMargin = avgServiceSize * (appState.globalMargins.serviceMargin / 100);
    const totalMargin = licenseMargin + serviceMargin;

    return {
      salesCycle: productData.salesCycle,
      totalServicePercentage: (totalServicePercentage * 100).toFixed(2) + '%',
      avgLicenseSize: formatNumber(avgLicenseSize),
      avgServiceSize: formatNumber(avgServiceSize),
      licenseMargin: formatNumber(licenseMargin),
      serviceMargin: formatNumber(serviceMargin),
      totalMargin: formatNumber(totalMargin),
    };
  };

  const handleFocus = (event) => {
    if (event.target.value === "0") {
      const inputName = event.target.name; // Get the name of the field
      setAppState((prevState) => ({
        ...prevState,
        globalMargins: {
          ...prevState.globalMargins,
          [inputName]: "",
        },
      }));
    }
  };

  const handleBlur = (event) => {
    if (event.target.value === "") {
      const inputName = event.target.name; // Get the name of the field
      setAppState((prevState) => ({
        ...prevState,
        globalMargins: {
          ...prevState.globalMargins,
          [inputName]: "0",
        },
      }));
    }
  };


  const defaultProgressionData = [
    { quarter: 'Q1 2025', value: 0 },
    { quarter: 'Q2 2025', value: 0 },
    { quarter: 'Q3 2025', value: 0 },
    { quarter: 'Q4 2025', value: 0 },
  ];
  
  const defaultYearlyMarginARRData = [
    { year: 'FY 2025', value: 0 },
    { year: 'FY 2026', value: 0 },
    { year: 'FY 2027', value: 0 },
    { year: 'FY 2028', value: 0 },
  ];

  const progressionData = appState && Object.keys(appState.calculatedData || {}).length > 0
  ? Object.keys(appState.calculatedData)
      .filter((key) => key.startsWith('Q'))
      .map((quarter) => ({
        quarter,
        value: appState.calculatedData[quarter]?.progressionTotalMarginARR || 0,
      }))
  : defaultProgressionData;

const yearlyMarginARRData = appState && Object.keys(appState.calculatedData || {}).length > 0
  ? ['FY 2025', 'FY 2026', 'FY 2027', 'FY 2028'].map((year) => ({
      year,
      value: appState.calculatedData[year]?.yearlyMarginARR || 0,
    }))
  : defaultYearlyMarginARRData;
// Pie Chart : Service/License margin ratio logic
const totalServiceMargin = appState.selectedProducts.reduce((acc, product) => {
  const productData = calculateProductData(product);
  return acc + parseFloat(productData.serviceMargin.replace(/[^0-9.-]+/g, '')); // Remove formatting and sum
}, 0);

const totalLicenseMargin = appState.selectedProducts.reduce((acc, product) => {
  const productData = calculateProductData(product);
  return acc + parseFloat(productData.licenseMargin.replace(/[^0-9.-]+/g, '')); // Remove formatting and sum
}, 0);

  const totalMargin = totalServiceMargin + totalLicenseMargin;
  const licenseServicePieData =
  totalMargin > 0
    ? [
        { name: 'Service Margin', value: (totalServiceMargin / totalMargin) * 100 },
        { name: 'License Margin', value: (totalLicenseMargin / totalMargin) * 100 },
      ]
    : [
        { name: 'Service Margin', value: 0 },
        { name: 'License Margin', value: 0 },
      ];



  const styles = {
    container: {
      padding: '20px',
      color: '#f1f1f1',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    mainContent: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    contentArea: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    graphsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '20px',
      marginLeft: '20px',
    },
    graph: {
      flex: '1',
      padding: '10px',
      backgroundColor: '#24233C',
      borderRadius: '8px',
    },
    sidebar: {
      backgroundColor: '#24233C',
      padding: '20px',
      borderRadius: '8px',
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      flexShrink: 0,
    },
    marginContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    marginInputContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      borderRadius: '5px',
      gap: '5px',
    },
    marginLabel: {
      marginBottom: '5px',
      fontSize: '14px',
      color: '#9A99A9',
    },
    marginInput: {
      width: '60px',
      padding: '5px',
      borderRadius: '3px',
      border: '1px solid #555',
      backgroundColor: '#05173A',
      color: '#f1f1f1',
      textAlign: 'center',
      outline: 'none',
    },
    dropdownContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    dropdown: {
      padding: '10px',
      backgroundColor: '#05173A',
      color: '#f1f1f1',
      border: '1px solid #555',
      borderRadius: '5px',
      outline: 'none',
    },
    factorContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: '#f1f1f1',
    },
    productFactors: {
      backgroundColor: '#16152E',
      padding: '10px',
      borderRadius: '8px',
    },
    tableContainer: {
      flex: '1',
      padding: '10px',
      backgroundColor: '#24233C',
      color: '#f1f1f1',
      borderRadius: '8px',
      overflowX: 'auto',
      marginLeft: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      borderBottom: '1px solid #555',
      padding: '8px',
      fontWeight: 'bold',
    },
    tableRow: {
      borderBottom: '1px solid #333',
    },
    tableData: {
      padding: '8px',
      textAlign: 'center',
    },
    graphTitles: {
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px',
      color: '#333',
    }
  };

  const selectedProducts = [selectedProduct1, selectedProduct2, selectedProduct3].filter(
    (product) => product !== 'None'
  );

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
        <div style={styles.marginContainer}>
          {/* Product Margin Input */}
          <div style={styles.marginInputContainer}>
            <TextField
            name="productMargin"
              label="Product Margin (%)" // Replaces the label
              type="number"
              value={appState.globalMargins.productMargin}
              onChange={handleGlobalMarginChange('productMargin')}
              inputProps={{ min: 0, max: 100 }} // Ensure valid numeric input
              onBlur={handleBlur}
              onFocus={handleFocus}
              fullWidth // Makes the input take up the full container width
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset':{
                    borderColor: '#f1f1f1',
                  },
                  backgroundColor: '#16152E', // Background color
                  color: '#f1f1f1', // Text color
                },
                '& .MuiInputLabel-root': {
                  color: '#f1f1f1', // Label color
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#020027', // Border color on focus
                },
              }}
            />
          </div>

          {/* Service Margin Input */}
          <div style={styles.marginInputContainer}>
            <TextField
              name="serviceMargin"
              label="Service Margin (%)"
              type="number"
              value={appState.globalMargins.serviceMargin}
              onChange={handleGlobalMarginChange('serviceMargin')}
              inputProps={{ min: 0, max: 100 }}
              onBlur={handleBlur}
              onFocus={handleFocus}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset':{
                    borderColor: '#f1f1f1',
                  },
                  backgroundColor: '#16152E', // Background color
                  color: '#f1f1f1', // Text color
                },
                '& .MuiInputLabel-root': {
                  color: '#f1f1f1', // Label color
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#020027', // Border color on focus
                },
              }}
            />
          </div>
        </div>

          <div>
            <h1>Select Products</h1>
              <div style={styles.dropdownContainer}>
                {[selectedProduct1, selectedProduct2, selectedProduct3].map((selectedProduct, index) => (
                  <FormControl fullWidth key={index} sx={{ marginBottom: '10px', minWidth: 200 }}>
                    <InputLabel 
                    id={`select-label-${index}`}
                    sx={{
                      color: '#f1f1f1',
                    }}
                    >Select Product {index + 1}
                    </InputLabel>
                      <Select
                        labelId={`select-label-${index}`}
                        value={selectedProduct}
                        onChange={handleSelectChange(
                          index === 0 ? setSelectedProduct1 :
                          index === 1 ? setSelectedProduct2 : setSelectedProduct3,
                          index
                        )}
                        label={`Select Product ${index + 1}`}
                        sx={{
                          '& .MuiSelect-select': {
                            backgroundColor: '#16152E', // Background color of dropdown
                            color: '#f1f1f1', // Text color
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f1f1f1', // Default border color
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#020027', // Hover border color
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1e90ff', // Focused border color
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#f1f1f1', // Dropdown arrow icon color
                          },
                        }}
                      >
                        <MenuItem value="None">None</MenuItem>
                        {products.map((product) => (
                          <MenuItem
                            key={product}
                            value={product}
                            disabled={selectedProducts.includes(product)}
                          >
                            {product}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                ))}
            </div>

            <div style={styles.factorContainer}>
              {selectedProducts.map((product) => (
                <div key={product} style={styles.productFactors}>
                  <h3>{product}</h3>
                  {factors.map((factor, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={!!appState.productFactors[product]?.[index]}
                          onChange={handleFactorChange(product, index)}
                          sx={{
                            color: '#555', // Unchecked color
                            '&.Mui-checked': {
                              color: '#1e90ff', // Checked color
                            },
                          }}
                        />
                      }
                      label={factor}
                      sx={{
                        marginBottom: '5px',
                        color: '#f1f1f1', // Label color
                      }}
                    />
                  ))}

                </div>
              ))}
            </div>
          </div>
        </div>
          <div style={styles.contentArea}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Product</th>
                    <th style={styles.tableHeader}>Sales Cycle</th>
                    <th style={styles.tableHeader}>Total Service %</th>
                    <th style={styles.tableHeader}>Avg License Size</th>
                    <th style={styles.tableHeader}>Avg Service Size</th>
                    <th style={styles.tableHeader}>License Margin</th>
                    <th style={styles.tableHeader}>Service Margin</th>
                    <th style={styles.tableHeader}>Total Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => {
                    const data = calculateProductData(product);
                    return (
                      <tr key={product} style={styles.tableRow}>
                        <td style={styles.tableData}>{product}</td>
                        <td style={styles.tableData}>{data.salesCycle}</td>
                        <td style={styles.tableData}>{data.totalServicePercentage}</td>
                        <td style={styles.tableData}>${data.avgLicenseSize}</td>
                        <td style={styles.tableData}>${data.avgServiceSize}</td>
                        <td style={styles.tableData}>${data.licenseMargin}</td>
                        <td style={styles.tableData}>${data.serviceMargin}</td>
                        <td style={styles.tableData}>${data.totalMargin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          
          {/* Graphs */}
          <div style={styles.graphsContainer}>
            <div style={styles.graph}>
              <h3 style={styles.graphTitle}>Progression of Total Margin ARR</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.graph}>
            <h3 style={styles.graphTitle}>Yearly Margin ARR</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyMarginARRData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.graph}>
            <h3 style={styles.graphTitle}>% License & Service Margin</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={licenseServicePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  >
                    <Cell key="Service Margin" fill="#FF8042" />
                    <Cell key="License Margin" fill="#0088FE" />
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;