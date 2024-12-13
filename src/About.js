import React from 'react';

const About = () => {
  const styles = {
    container: {
      padding: '20px',
      color: '#f1f1f1',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    subTitle: {
        fontSize:'20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    text: {
      fontSize: '16px',
      lineHeight: '1.5',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SaaS Financial Model Illustrator</h1>
      <h2 style={styles.subTitle}>Introduction</h2>
      <p style={styles.text}>
        <pre></pre>This web application is designed to provide suggestive revenue projections.
        These projections are based on selected Siemens 
        products and services, margins,and your inputs of projected new deals,
        expansion %, downgrade % and churn % per quarter
        across the 2025 to 2028 fiscal years. <br></br><br></br>Disclaimer: This tool 
        provides revenue projections solely as an indicative
        estimate based on simplified calculations. Actual results may
        vary significantly due to numerous external and internal 
        factors. This document is not a guarantee of future 
        performance. Siemens is not liable for any discrepancies or decisions made based on these projections.
      </p>
      <h2 style={styles.subTitle}>Step-by-Step Guide</h2>
      <p style={styles.text}>
        <p style={{fontWeight:'bold'}}>Step 1: Product Selection</p>
         <li>Navigate to the Product Selection tab at the top of the window</li>
         <li>Select up to three products from the dropdown menus</li>
         <li>Choose relevant factors that fit the selected products in the checkboxes below the product selection's dropdown menus</li>
         <li>Set a realistic product margin and service margin percentage</li>
        <p style={{fontWeight:'bold'}}>Step 2: Understanding the Product Assumptions</p>
         <li>The product assumptions table will dynamically change based on the selected products,
         services, and set margins</li>
         <li>This table will show a number of a assumed values that are used for
         future calculations for each selected product based on your inputs</li>
        <p style={{fontWeight:'bold'}}>Step 3: Quarterly ARR Projections</p>
         <li>Navigate to the Quarterly ARR Projections tab at the top of the window</li>
         <li>Based on inputs from the Product Selection screen and a number of inputs within the table itself,
             this table will give an illustration of a number of projected values
             across the 2025 to 2028 fiscal years for each quarter making up those years </li>
         <li>These values will dynamically update as you enter values into the expected new deals per quarter of each selected product,
            expansion percentage, downgrade percentage, and churn percentage for each quarter
         </li>
        <p style={{fontWeight:'bold'}}>Step 4: Understanding the Graphs</p>
         <li>After updating the Quarterly ARR Projections with inputs of expected values,
             navigate back to the Product Selection tab at the top of the window
         </li>
         <li>Here you will see an updated line graph expressing the progression of total margin ARR over the entire
            4 fiscal years for each quarter
         </li>
         <li>Next is the updated bar graph which illustrates the expected yearly margin ARR at the end of each fiscal year</li>
         <li>Finally, the pie chart at the bottom of the Product Selection page shows the ratio of License Margin 
            (based on selected products) to Service Margin (based on selected product services)
         </li>   
        <p style={{fontWeight:'bold'}}>Step 5: Exporting for Further Use</p>
         <li>Each page has an available export button towards the bottom right of the window allowing for easy implementation
            of the models once they have reached a desired display of data
         </li>
         <li>The Product Selection page allows for a pdf export of the Products Assumptions and the
            three graphs
         </li>
         <li>The Quarterly ARR Projections page allows for both a pdf export and a excel export of the table and inputs</li>
         <li>Exporting as a PDF will cause sizing differences to occur depending on your browsers
            window height and width, if problems with exporting as a PDF occur try changing this size 
            to combat the issue
         </li>
      </p>
    </div>
  );
};

export default About;
