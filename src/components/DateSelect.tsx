import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { log } from 'console';
import { InputLabel, MenuItem, Select, styled } from '@mui/material';
import { useEffect, useState } from 'react';
interface Session {
  id: number;
  startTime: string;
  endTime: string;
  sessionDate: string;
  // orders: CustomerOrder[];
}
interface Props {
  //selectedSessionId: number;
  onChange: (value: number) => void;
  timeList: Session[];
}
const CustomRadio = styled(Radio)`
  color: #757575; /* Change the color to red */
  &.Mui-checked {
    color:#757575; /* Change the color to white when checked */
  }

`;
const CustomTimeRadio = styled(Radio)`
color: #1565c0; /* Change the color to blue */
&.Mui-checked {
  color:#1565c0; /* Change the color to white when checked */
}
`;
const CustomFormControlLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    color: grey; /* Set label text color to white */
    margin-right: 14px
  }
  
`;
const CustomFormControl = styled(FormControl)`
  margin-bottom: 8px; // Add margin to the bottom to reduce the form's height
  margin-top: 12px; 
`;

const CustomRadioGroup = styled(RadioGroup)`
  margin-bottom: 0px; // Add negative margin to compensate for the smaller FormControl's margin
 
  `;
export default function DateSelect({  onChange, timeList }: Props) {
// export const DateSelect: React.FC<Props> = ({ timeList, ...rest }) => {
  console.log(timeList);
  const dateAndTimeMap = new Map<string, string[]>();
  for (const time of timeList) {
    const { sessionDate, startTime, id } = time;
    if (dateAndTimeMap.has(sessionDate)) {
      // If the date is already in the map, append the startTime
      dateAndTimeMap.get(sessionDate)?.push(startTime);
    } else {
      // If the date is not in the map, create a new array with startTime
      dateAndTimeMap.set(sessionDate, [startTime]);
    }
  }
  console.log("dateAndTimeMap:", dateAndTimeMap);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const timesForSelectedDate = dateAndTimeMap.get(selectedDate) || [];

  // useEffect(() => {
  //   console.log("selectedDate:", selectedDate);//setState is asynchronous,
  //   // which means that when you call setSelectedDate(event.target.value);, the state selectedDate may not immediately update to the new value.
  // }, [selectedDate]); //so you should use the useEffect hook to watch for changes in the state.

  // useEffect(() => {
  //   console.log("selectedTime:", selectedTime);
  // }, [selectedTime]);

  const handleDateChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedDate(event.target.value);
    setSelectedTime(""); // Clear selected time when date changes
  };

  const handleTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedTime(event.target.value);
    const selectedSession = timeList.find((time)=>time.sessionDate===selectedDate && time.startTime===event.target.value);
    if (selectedSession) {
      console.log("hi");
      onChange(selectedSession.id); // Notify the parent component of the selected session_id
    }
  };

  return (
    <div>
      <FormControl fullWidth >
        <FormLabel id="demo-row-radio-buttons-group-label"  sx={{color:"black",fontSize: '18px',marginBottom:'10px' }} >
          請選擇日期:
          </FormLabel>
        <CustomRadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selectedDate}
          onChange={handleDateChange}
        >
          {Array.from(dateAndTimeMap.keys()).map((date) => (
           <CustomFormControlLabel value={date} control={<CustomRadio />} label={date} />
          ))}
        </CustomRadioGroup>
      </FormControl>
      {selectedDate && (
        <CustomFormControl  fullWidth>
          <FormLabel id="demo-row-radio-buttons-group-label"  sx={{color:"black",fontSize: '18px',marginBottom:'10px' }}>
            請選擇場次:
          </FormLabel>
          <CustomRadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selectedTime}
          onChange={handleTimeChange}
        >
            {timesForSelectedDate.map((time) => (
              <CustomFormControlLabel value={time} control={<CustomTimeRadio />} label={time} />
            ))}
          </CustomRadioGroup>
        </CustomFormControl>
      )}
    </div>
  );
}

//export default DateSelect;   