import React from "react";
import { InputGroupText, Label, FormGroup } from "reactstrap";
import styles from "./styles.module.css";
import DatePicker from "react-datepicker";
//
import { FaRegCalendarAlt } from "react-icons/fa";
//

const InputTypeDate = ({ name, comClass, text, value, onChange }) => {
  const handleChange = (e) => {
    onChange(name, e);
  };
  return (
    <FormGroup className={`${comClass} ${styles.container}`}>
      <Label for="form-2-first-name">{text}</Label>
      <div className={`d-flex ${styles.wrapper}`}>
        <InputGroupText>
          <FaRegCalendarAlt />
        </InputGroupText>
        <DatePicker
          className="form-control"
          selected={value}
          onChange={(date) => handleChange(date)}
        />
      </div>
    </FormGroup>
  );
};

export default InputTypeDate;
