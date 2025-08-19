import React from "react";
import {
  NumericFormat,
  type NumericFormatProps,
  type OnValueChange,
} from "react-number-format";
import type { InputBaseComponentProps } from "@mui/material/InputBase";

type BaseProps = Omit<InputBaseComponentProps, "onChange">;

interface NumericFormatCustomProps extends BaseProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<
  NumericFormatProps,
  NumericFormatCustomProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  const handleValueChange: OnValueChange = (values) => {
    onChange({
      target: {
        name: props.name,
        value: values.value,
      },
    });
  };

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
    />
  );
});

export default NumericFormatCustom;
