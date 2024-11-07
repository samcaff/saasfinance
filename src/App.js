import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

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

const App = () => {
    const products = Object.keys(productDetails);
    const factors = [
        "Software Apps & Add-Ons", "Custom Apps", "Systems Integration & Process Automation", "Product Content",
        "CORE Consulting", "Custom Workflows", "Enhanced Support & Training", "Product & Data Configuration", "Scaled Product Rollout"
    ];

    const [selectedProduct1, setSelectedProduct1] = useState("None");
    const [selectedProduct2, setSelectedProduct2] = useState("None");
    const [selectedProduct3, setSelectedProduct3] = useState("None");

    const [productFactors, setProductFactors] = useState({});
    const [servicePercentages, setServicePercentages] = useState({});
    const [globalMargins, setGlobalMargins] = useState({ productMargin: "", serviceMargin: "" });

    const handleSelectChange = (setSelectedProduct) => (event) => {
        const selectedProduct = event.target.value;
        setSelectedProduct(selectedProduct);
        if (selectedProduct !== "None") {
            setServicePercentages(prev => ({ ...prev, [selectedProduct]: 0 }));
            setProductFactors(prev => ({ ...prev, [selectedProduct]: {} }));
        }
    };

    const handleFactorChange = (product, factorIndex) => (event) => {
        const isSelected = event.target.checked;
        setProductFactors(prevState => ({
            ...prevState,
            [product]: {
                ...prevState[product],
                [factorIndex]: isSelected
            }
        }));

        setServicePercentages(prevState => {
            const serviceFactorArray = productDetails[product].serviceFactors;
            const newTotal = Object.entries({
                ...productFactors[product],
                [factorIndex]: isSelected
            })
                .filter(([, selected]) => selected)
                .reduce((total, [index]) => total + serviceFactorArray[index], 0);
            return { ...prevState, [product]: newTotal };
        });
    };

    const handleGlobalMarginChange = (marginType) => (event) => {
        let value = Math.max(0, Math.min(100, Number(event.target.value)));
        setGlobalMargins(prevState => ({
            ...prevState,
            [marginType]: value
        }));
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };

    const calculateProductData = (product) => {
        const productData = productDetails[product];
        const totalServicePercentage = servicePercentages[product] || 0;
        const avgLicenseSize = productData.licenseSize;
        const avgServiceSize = avgLicenseSize * totalServicePercentage;
        const licenseMargin = avgLicenseSize * (globalMargins.productMargin / 100);
        const serviceMargin = avgServiceSize * (globalMargins.serviceMargin / 100);
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

    const styles = {
        container: {
            padding: "20px",
            color: "#f1f1f1",
            backgroundColor: "#1e1e1e",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        marginContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
        },
        marginInputContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#333',
            padding: '10px',
            borderRadius: '5px',
        },
        marginLabel: {
            marginBottom: '5px',
            fontSize: '14px',
            color: '#aaa',
        },
        marginInput: {
            width: '60px',
            padding: '5px',
            borderRadius: '3px',
            border: '1px solid #555',
            backgroundColor: "#222",
            color: "#f1f1f1",
            textAlign: 'center',
            outline: 'none',
        },
        mainContent: {
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
        },
        dropdownContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '300px',
        },
        dropdown: {
            padding: "10px",
            backgroundColor: "#333",
            color: "#f1f1f1",
            border: "1px solid #555",
            borderRadius: "5px",
            outline: "none",
        },
        factorContainer: {
            display: 'flex',
            flexDirection: 'column',  // Stack factor selections vertically
            gap: '20px',
            marginTop: "20px",
            color: '#f1f1f1',
        },
        productFactors: {
            backgroundColor: "#2a2a2a",
            padding: "10px",
            borderRadius: "8px",
        },
        tableContainer: {
            padding: '10px',
            backgroundColor: "#2e2e2e",
            color: '#f1f1f1',
            borderRadius: '8px',
            width: '800px',
            maxHeight: '240px',
            overflowY: 'auto',
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
    };

    const selectedProducts = [selectedProduct1, selectedProduct2, selectedProduct3].filter(product => product !== "None");

    return (
        <div style={styles.container}>
            <div style={styles.marginContainer}>
                <div style={styles.marginInputContainer}>
                    <label style={styles.marginLabel}>Product Margin (%)</label>
                    <input
                        type="number"
                        value={globalMargins.productMargin}
                        onChange={handleGlobalMarginChange("productMargin")}
                        min="0"
                        max="100"
                        style={styles.marginInput}
                    />
                </div>
                <div style={styles.marginInputContainer}>
                    <label style={styles.marginLabel}>Service Margin (%)</label>
                    <input
                        type="number"
                        value={globalMargins.serviceMargin}
                        onChange={handleGlobalMarginChange("serviceMargin")}
                        min="0"
                        max="100"
                        style={styles.marginInput}
                    />
                </div>
            </div>

            <div style={styles.mainContent}>
                <div>
                    <h1>Select Products</h1>
                    <div style={styles.dropdownContainer}>
                        {[selectedProduct1, selectedProduct2, selectedProduct3].map((selectedProduct, index) => (
                            <select
                                key={index}
                                onChange={handleSelectChange(
                                    index === 0 ? setSelectedProduct1 :
                                    index === 1 ? setSelectedProduct2 : setSelectedProduct3
                                )}
                                value={selectedProduct}
                                style={styles.dropdown}
                            >
                                <option value="None">None</option>
                                {products.map((product) => (
                                    <option
                                        key={product}
                                        value={product}
                                        disabled={selectedProducts.includes(product)}
                                    >
                                        {product}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>

                    <div style={styles.factorContainer}>
                        {selectedProducts.map(product => (
                            <div key={product} style={styles.productFactors}>
                                <h3>{product}</h3>
                                {factors.map((factor, index) => (
                                    <label key={index} style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="checkbox"
                                            checked={!!productFactors[product]?.[index]}
                                            onChange={handleFactorChange(product, index)}
                                        /> {factor}
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default App;