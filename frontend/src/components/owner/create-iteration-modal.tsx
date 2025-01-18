import axios from "axios";
import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { getIterationsList } from "../../redux/reducers/iterations";
import { endpoints } from "../../shared/constants";
import { useAppDispatch } from "../../shared/custom-hooks";
import { formatDateToYYYYMMDD } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import { CustomDateInput } from "../shared/custom-date-input";
import { CustomInput, InputTypes } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const CreateIterationModal = ({
  show,
  closeAction,
  selectedIteration,
}) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<MyForm>({
    name: {
      value: selectedIteration?.name || "",
      valid: selectedIteration?.name ? true : false,
      touched: false,
      minLength: 2,
    },
    startDate: {
      value: selectedIteration?.startDate || null,
      valid: selectedIteration?.startDate ? true : false,
      touched: false,
    },
    endDate: {
      value: selectedIteration?.endDate || null,
      valid: selectedIteration?.startDate ? true : false,
      touched: false,
    },
  });
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
    let startDate = null;
    let endDate = null;
    if (Array.isArray(selectedDates)) {
      const [start, end] = selectedDates;
      startDate = start;
      endDate = end;
    }

    setForm({
      ...form,
      startDate: {
        ...form.startDate,
        value: startDate && formatDateToYYYYMMDD(startDate),
        valid: handleValidate("startDate", startDate),
        touched: true,
      },
      endDate: {
        ...form.endDate,
        value: endDate && formatDateToYYYYMMDD(endDate),
        valid: handleValidate("endDate", endDate),
        touched: true,
      },
    });
  };

  const handleValidate = (name, value) => {
    if (name === "name") {
      return value.length >= form[name].minLength;
    }
    if (name === "startName" || name === "endDate") {
      return value !== null;
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
      if (!selectedIteration) {
        await axios.post(
          endpoints.CREATE_NEW_ITERATION,
          JSON.stringify({
            name: form.name.value,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
          })
        );
      } else {
        await axios.put(
          endpoints.EDIT_ITERATION,
          JSON.stringify({
            iterationId: selectedIteration.id,
            name: form.name.value,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
          })
        );
      }

      setLoading(false);
      closeAction();
      dispatch(getIterationsList());
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
          {selectedIteration ? "Edit Iteration" : "Create new Iteration"}
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
                selected={form.startDate.value}
                startDate={form.startDate.value}
                endDate={form.endDate.value}
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
