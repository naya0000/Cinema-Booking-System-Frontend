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
      <FormControl sx={{ m: 1, minWidth: 190,marginLeft:'-5px' }}>
        <InputLabel id="paymentId">支付方式</InputLabel>
        <Select
          labelId="paymentId"
          id="demo-simple-select-autowidth"
          value={payment}
          label="Payment"
          onChange={handleChange}
          //style={{marginLeft:'-5px'}}
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
