import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props{
  onChange: (ticket: string) => void;
}
export default function TicketSelect({ onChange }: Props) {
  const [ticket, setTicket] = React.useState('');
  const tickets: string[] = ['全票','優待票'];

  const handleChange = (event: SelectChangeEvent) => {
    setTicket(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Box sx={{minWidth: 80 }}>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Ticket</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={ticket}
          label="Ticket"
          onChange={handleChange}
        >
          {tickets.map((ticket) => (
            <MenuItem key={ticket} value={ticket}>  
            {ticket}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
