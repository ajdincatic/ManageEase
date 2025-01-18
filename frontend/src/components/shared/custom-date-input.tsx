import { Form, FormControlProps } from "react-bootstrap";
import DatePicker from "react-datepicker";

import { isWeekday } from "../../shared/helpers";
import styles from "../styles/custom-input.module.css";

type Props = {
  onChange: FormControlProps["onChange"];
  label?: string;
  className?: string;
  showIcon?: boolean;
  setLabel?: boolean;
  isClearable?: boolean;
  selectsRange?: boolean;
  selected?: Date | undefined;
  startDate?: string | Date | undefined;
  endDate?: string | Date | undefined;
  minDate?: string | Date | undefined;
  maxDate?: string | Date | undefined;
  error?: string;
  defaultValue?: any;
  highlightDates?: any[];
};

export const CustomDateInput = ({
  className = "mb-3",
  selectsRange,
  onChange,
  setLabel = true,
  label = "",
  showIcon = true,
  isClearable = true,
  selected = undefined,
  startDate = undefined,
  endDate = undefined,
  minDate = undefined,
  maxDate = undefined,
  error,
  highlightDates,
}: Props) => (
  <Form.Group className={className}>
    {setLabel && (
      <Form.Label>
        {label
          ? label
          : selectsRange
          ? "Select date or range of dates"
          : "Select date"}
      </Form.Label>
    )}
    <DatePicker
      dateFormat={"dd.MM.yyyy"}
      showIcon={showIcon}
      className="form-control"
      selectsDisabledDaysInRange={false}
      calendarStartDay={1}
      isClearable={isClearable}
      onChange={onChange}
      selected={selected && new Date(selected)}
      startDate={startDate && new Date(startDate)}
      endDate={endDate && new Date(endDate)}
      selectsRange={selectsRange}
      minDate={minDate && new Date(minDate)}
      maxDate={maxDate && new Date(maxDate)}
      filterDate={isWeekday}
      highlightDates={highlightDates}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      placeholderText={
        selectsRange ? "Select date or range of dates" : "Select date"
      }
    />
    {error && <Form.Text className={styles.formText}>{error}</Form.Text>}
  </Form.Group>
);
