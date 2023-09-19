import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { log } from 'console';
import { isInterfaceDeclaration } from 'typescript';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Seat {
  id: number;
  seatNumber: string;
  isAvailable: number;
}
interface Props {
  movieSeats: Seat[];
  quantity: number;
  onChange: (selectedSeats: number[] | string) => void;
}
export const SeatSelect: React.FC<Props> = ({ movieSeats, quantity, onChange }) => {
  // console.log("seats:",seats);
  // const [seat, setSeat] = React.useState<string[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = React.useState<number[]>([]);
  const [showWarning, setShowWarning] = React.useState(false); 

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const selectedIds: number[] = event.target.value as number[];
    setSelectedSeatIds(selectedIds);
    onChange(selectedIds); // Pass the array of selected seat IDs to the parent component
    if (selectedIds.length === quantity) {
      setShowWarning(false);
    }else{
      setShowWarning(true);
    }
    // console.log("selectedSeatObjects:",selectedSeatObjects)
    // onChange(selectedSeatObjects);
  };


  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id="demo-multiple-checkbox-label">Seats</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedSeatIds}
          onChange={handleChange}
          input={<OutlinedInput label="Seats" />}
          renderValue={(selected) =>
            movieSeats
              .filter((seat) => selected.includes(seat.id))
              .map((seat) => seat.seatNumber)
              .join(', ')
          }
          //renderValue={(selected) => (selected as Seat[]).join(', ')}
          MenuProps={MenuProps}
        >
          {movieSeats.filter((movieSeat) => movieSeat.isAvailable === 1)
            .map((movieSeat) => (
              <MenuItem key={movieSeat.id} value={movieSeat.id}> {/* Use seat.id as the value */}
                <ListItemText primary={movieSeat.seatNumber} />
              </MenuItem>
            ))}
        </Select>
        {showWarning && (
          <Typography variant="caption" color="error">
            請選擇 {quantity} 個座位.
          </Typography>
        )}
      </FormControl>
    </Box>
  );
}
export default SeatSelect;
