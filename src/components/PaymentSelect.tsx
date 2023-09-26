import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props{
  onChange: (value: string) => void;
}
export default function PaymentSelect({ onChange }: Props) {
  const [payment, setPayment] = React.useState('');
  const payments: string[] = ['信用卡','現金','LINE_PAY'];

  const handleChange = (event: SelectChangeEvent) => {
    setPayment(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Box sx={{ m: 1, minWidth: 80 }}>
      <FormControl sx={{ m: 1, minWidth: 190 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Payment</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={payment}
          label="Payment"
          onChange={handleChange}
        >
          {payments.map((payment) => (
            <MenuItem key={payment} value={payment}>  
            {payment}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
