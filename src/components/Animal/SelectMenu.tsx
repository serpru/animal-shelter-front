import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface Props<T> {
  onChange: () => void;
  value: string | undefined;
  valueMap: T[];
}

function SelectMenu<T extends { id: number; description: string }>({
  onChange,
  value,
  valueMap,
}: Props<T>) {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Size</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Species"
        onChange={onChange}
      >
        {valueMap.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectMenu;
