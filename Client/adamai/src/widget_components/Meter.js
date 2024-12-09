import React from 'react';
import { Slider, Typography } from '@mui/material';

const Meter = ({ value, onChange, title, min = 0, max = 1, allowDecimals = true }) => {
  // Ensure value is a number
  const numericValue = Number(value);
  const step = allowDecimals ? 0.001 : 1;

  return (
    <div style={{ width: 300, margin: '0 auto' }}>
      <Typography variant="h6">{title}</Typography>
      <Slider
        value={numericValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
      />
      <Typography variant="body1">{numericValue.toFixed(allowDecimals ? 3 : 0)}</Typography>
    </div>
  );
};

export default Meter;