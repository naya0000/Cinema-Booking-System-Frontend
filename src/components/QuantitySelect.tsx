import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  value: string;
  onChange: (value: string) => void;
}
export default function QuantitySelect({ value, onChange }: Props) {
  //const [quant, setQuant] = React.useState('');
  const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl sx={{  m: 1,minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Quantity</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value}
          label="Quantity"
          onChange={handleChange}
        >
          {numbers.map((number) => (
            <MenuItem key={number} value={number.toString()}>  
            {number}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
