// ProjectionSummary.js
import React from 'react';

const ProjectionSummary = ({ calculatedData }) => (
  <div>
    {Object.keys(calculatedData).map((quarter) => (
      <div key={quarter}>
        <h4>{quarter}</h4>
        <p>{calculatedData[quarter].endingMarginARR.toFixed(2)}</p>
        <p>{calculatedData[quarter].quarterlyMarginARRTotal.toFixed(2)}</p>
      </div>
    ))} 
  </div>
);

export default ProjectionSummary;
