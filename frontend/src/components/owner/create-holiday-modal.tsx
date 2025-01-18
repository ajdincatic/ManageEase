import axios from "axios";
import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { getHolidaysList } from "../../redux/reducers/holidays";
import { endpoints } from "../../shared/constants";
import { useAppDispatch } from "../../shared/custom-hooks";
import { getDateArrayFromRange } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import { CustomDateInput } from "../shared/custom-date-input";
import { CustomInput, InputTypes } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const CreateHolidayModal = ({
  show,
  closeAction,
  selectedHoliday = null,
}) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<MyForm>({
    name: {
      value: selectedHoliday?.name || "",
      valid: selectedHoliday?.name ? true : false,
      touched: false,
      minLength: 2,
    },
    dates: {
      value: selectedHoliday?.dates || [],
      valid: selectedHoliday?.name ? true : false,
      touched: false,
    },
  });
  const [startDate, setStartDate] = useState(
    selectedHoliday?.dates ? new Date(selectedHoliday.dates[0]) : null
  );
  const [endDate, setEndDate] = useState(
    selectedHoliday?.dates
      ? new Date(
          selectedHoliday.dates[selectedHoliday.numberOfSelectedDays - 1]
        )
      : null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: {
        ...form[name],
        value,
        valid: handleValidate(name, value),
        touched: true,
      },
    });
  };

  const handleDatePickerChange = (selectedDates) => {
    let arrayOfDates: string[];

    if (Array.isArray(selectedDates)) {
      const [start, end] = selectedDates;
      setStartDate(start);
      setEndDate(end);

      arrayOfDates = getDateArrayFromRange(start, end);
    } else {
      setStartDate(selectedDates);
      setEndDate(null);

      arrayOfDates = getDateArrayFromRange(selectedDates, null);
    }

    setForm({
      ...form,
      dates: {
        ...form.dates,
        value: arrayOfDates,
        valid: handleValidate("dates", arrayOfDates.length),
        touched: true,
      },
    });
  };

  const handleValidate = (name, value) => {
    if (name === "name") {
      return value.length >= form[name].minLength;
    } else if (name === "dates") {
      return value >= 1;
    }

    return true;
  };

  const isDisabled = () => {
    for (const key of Object.keys(form)) {
      if (!form[key].valid) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled()) return;

    setLoading(true);

    try {
      if (!selectedHoliday) {
        await axios.post(
          endpoints.CREATE_NEW_HOLIDAY,
          JSON.stringify({
            name: form.name.value,
            dates: form.dates.value,
          })
        );
      } else {
        await axios.put(
          endpoints.EDIT_HOLIDAY,
          JSON.stringify({
            holidayId: selectedHoliday.id,
            name: form.name.value,
            dates: form.dates.value,
          })
        );
      }

      setLoading(false);
      closeAction();
      dispatch(getHolidaysList());
    } catch (error) {
      setLoading(false);

      setError(
        Array.isArray(error.response.data?.["message"])
          ? error.response.data?.["message"].join(" | ")
          : error.response.data?.["message"]
      );

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <Modal fullscreen={"md-down"} size="lg" show={show} onHide={closeAction}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedHoliday ? "Edit Holiday" : "Create new Holiday"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-5">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <CustomInput
                inputType={InputTypes.TEXT}
                name="name"
                label="Name"
                placeholder="Enter name"
                value={form.name.value}
                onChange={handleInputChange}
                error={
                  form.name.touched &&
                  !form.name.valid &&
                  "The minimum length of this field is 2 characters."
                }
              />

              <CustomDateInput
                setLabel={true}
                selectsRange={true}
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                onChange={handleDatePickerChange}
              />

              <Button variant="primary" type="submit" disabled={isDisabled()}>
                Submit
              </Button>
            </Form>
            {error && (
              <Alert className="mt-3" variant="danger">
                {error}
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
