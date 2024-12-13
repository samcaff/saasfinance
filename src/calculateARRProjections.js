const calculateARRProjections = (state) => {
    const { selectedProducts, quarterlyData, globalMargins } = state;
    const calculatedData = {};
    const quarters = Object.keys(quarterlyData);
  
    let progressionTotalMarginARR = 0; // Running total for progression of total margin ARR
    let progressionTotalRevenueARR = 0;

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
// margin calculations  
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
      const beginningMarginARR = quarters
        .slice(0, quarters.indexOf(quarter)) // Get all previous quarters
        .slice(-12) // Take the last 12 quarters
        .reduce((acc, prevQuarter) => acc + (calculatedData[prevQuarter]?.quarterlyMarginARRTotal || 0), 0);
  
      // Calculate Expansion, Downgrade, and Churn ARR
      const expansionARR = beginningMarginARR * (expansion / 100);
      const downgradeARR = -beginningMarginARR * (downgrade / 100);
      const churnARR = -beginningMarginARR * (churn / 100);
  
      // Calculate Quarterly Margin ARR Total and Ending Margin ARR
      const quarterlyMarginARRTotal = newArrMarginTotal + expansionARR + downgradeARR + churnARR;
      const endingMarginARR = beginningMarginARR + quarterlyMarginARRTotal;
  
      // Update the running total for progression of total margin ARR
      progressionTotalMarginARR += endingMarginARR;
  
//revenue calculations
      const quarterlyRevenueLicenses = selectedProducts.reduce((acc, product) => {
        const newDeals = quarterlyData[quarter]?.[product]?.newDeals || 0;
        return acc + arpu[product] * newDeals;
      }, 0);

      const quarterlyRevenueServices = selectedProducts.reduce((acc, product) => {
        const newDeals = quarterlyData[quarter]?.[product]?.newDeals || 0;
        return acc + profServices[product] * newDeals;
      }, 0);

      const newRevenueTotal = quarterlyRevenueLicenses + quarterlyRevenueServices;

      const beginningRevenueARR = quarters
        .slice(0, quarters.indexOf(quarter))
        .slice(-12)
        .reduce((acc, prevQuarter) => acc + (calculatedData[prevQuarter]?.newRevenueTotal || 0), 0);

      const expansionRevenueARR = beginningRevenueARR * (expansion / 100);
      const downgradeRevenueARR = -beginningRevenueARR * (downgrade / 100);
      const churnRevenueARR = -beginningRevenueARR * (churn / 100);

      const quarterlyRevenueARRTotal = newRevenueTotal + expansionRevenueARR + downgradeRevenueARR + churnRevenueARR;
      const endingRevenueARR = beginningRevenueARR + quarterlyRevenueARRTotal;
      progressionTotalRevenueARR += endingRevenueARR;

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
        progressionTotalMarginARR,

        beginningRevenueARR,
        quarterlyRevenueLicenses,
        quarterlyRevenueServices,
        newRevenueTotal,
        expansionRevenueARR,
        downgradeRevenueARR,
        churnRevenueARR,
        quarterlyRevenueARRTotal,
        endingRevenueARR,
        progressionTotalRevenueARR,
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
    years.forEach((year, index) => {
      const startQuarter = index * 4;
      const endQuarter = startQuarter + 4;
      const yearlyTotal = quarters
          .slice(startQuarter, endQuarter)
          .reduce((acc, quarter) => acc + (calculatedData[quarter]?.endingRevenueARR || 0), 0);
      calculatedData[year] = { ...calculatedData[year], yearlyRevenueARR: yearlyTotal };
    });
    
    return calculatedData;
  };
  
  export default calculateARRProjections;