import { Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";

function WorkSchedule() {
  function generateTodayDate() {
    let today_raw = dayjs(new Date());
    today_raw = today_raw.hour(8);
    today_raw = today_raw.minute(0);
    today_raw = today_raw.second(0);
    console.log(today_raw.toString());
    return today_raw;
  }

  const today = generateTodayDate();

  const [shiftStart, setShiftStart] = React.useState<Dayjs | null>(today);
  const [shiftEnd, setShiftEnd] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T16:00")
  );

  useEffect(() => {
    console.log(shiftStart?.toDate().toISOString());
  }, [shiftStart]);

  return (
    <>
      <Typography>Employee name</Typography>
      <TimePicker
        label="Shift start"
        value={shiftStart}
        onChange={(newValue) => setShiftStart(newValue)}
        ampm={false}
      />
      <TimePicker
        label="Shift end"
        value={shiftEnd}
        onChange={(newValue) => setShiftEnd(newValue)}
        ampm={false}
      />
    </>
  );
}

export default WorkSchedule;
