import ProductSelection from './ProductSelection';
const calculateARRProjections = (state) => {
    const { selectedProducts, quarterlyData, globalMargins, productFactors } = state;
    const calculatedData = {};
    const quarters = Object.keys(quarterlyData);
  
    let progressionTotalMarginARR = 0; // Running total for progression of total margin ARR
  
    quarters.forEach((quarter) => {
      calculatedData[quarter] = {};
  
      const arpu = {};
      const profServices = {}; 
      // Calculate ARPU and Professional Services per Deal for each product
      selectedProducts.forEach((product) => {
        arpu[product] = state.arpu[product] || 0; // Reference updated ARPU
        profServices[product] = state.professionalServices[product] || 0; // Reference updated Professional Services per Deal
      });
      
  
      // Retrieve expansion, downgrade, and churn percentages for the quarter
      const expansion = quarterlyData[quarter]?.expansion || 0;
      const downgrade = quarterlyData[quarter]?.downgrade || 0;
      const churn = quarterlyData[quarter]?.churn || 0;
  
      // Calculate New ARR Margin Licenses and Services based on ARPU and Professional Services per Deal
      const newArrMarginLicenses = selectedProducts.reduce((acc, product) => {
        const newDeals = quarterlyData[quarter]?.[product]?.newDeals || 0;
        return acc + arpu[product] * newDeals * (globalMargins.productMargin / 100);
      }, 0);
  
      const newArrMarginServices = selectedProducts.reduce((acc, product) => {
        const newDeals = quarterlyData[quarter]?.[product]?.newDeals || 0;
        return acc + profServices[product] * newDeals * (globalMargins.serviceMargin / 100);
      }, 0);
  
      const newArrMarginTotal = newArrMarginLicenses + newArrMarginServices;
  
      // Calculate Beginning Margin ARR based on previous quarters
      const beginningMarginARR = progressionTotalMarginARR;
  
      // Calculate Expansion, Downgrade, and Churn ARR
      const expansionARR = beginningMarginARR * (expansion / 100);
      const downgradeARR = -beginningMarginARR * (downgrade / 100);
      const churnARR = -beginningMarginARR * (churn / 100);
  
      // Calculate Quarterly Margin ARR Total and Ending Margin ARR
      const quarterlyMarginARRTotal = newArrMarginTotal + expansionARR + downgradeARR + churnARR;
      const endingMarginARR = beginningMarginARR + quarterlyMarginARRTotal;
  
      // Update the running total for progression of total margin ARR
      progressionTotalMarginARR += endingMarginARR;
  
      // Store the calculated values for this quarter
      calculatedData[quarter] = {
        beginningMarginARR,
        newArrMarginLicenses,
        newArrMarginServices,
        newArrMarginTotal,
        expansionARR,
        downgradeARR,
        churnARR,
        quarterlyMarginARRTotal,
        endingMarginARR,
      };
    });
  
    // Calculate Yearly Margin ARR for each fiscal year by summing quarters
    const years = ['FY 2025', 'FY 2026', 'FY 2027', 'FY 2028'];
    years.forEach((year, index) => {
      const startQuarter = index * 4;
      const endQuarter = startQuarter + 4;
      const yearlyTotal = quarters
        .slice(startQuarter, endQuarter)
        .reduce((acc, quarter) => acc + (calculatedData[quarter]?.endingMarginARR || 0), 0);
      calculatedData[year] = { yearlyMarginARR: yearlyTotal };
    });
  
    // Add progression of total margin ARR to each quarter
    quarters.forEach((quarter) => {
      calculatedData[quarter].progressionTotalMarginARR = progressionTotalMarginARR;
    });
  
    return calculatedData;
  };
  
  export default calculateARRProjections;