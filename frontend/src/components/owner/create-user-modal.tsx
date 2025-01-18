import axios from "axios";
import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { getUsers } from "../../redux/reducers/users";
import { endpoints } from "../../shared/constants";
import { useAppDispatch } from "../../shared/custom-hooks";
import { formatDateToYYYYMMDD } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import { CustomDateInput } from "../shared/custom-date-input";
import { CustomInput, InputTypes } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const CreateUserModal = ({ show, closeAction, selectedUser }) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<MyForm>({
    firstName: {
      value: selectedUser?.firstName || "",
      valid: selectedUser?.firstName ? true : false,
      touched: false,
      minLength: 2,
      shouldValidate: true,
    },
    lastName: {
      value: selectedUser?.lastName || "",
      valid: selectedUser?.lastName ? true : false,
      touched: false,
      minLength: 2,
      shouldValidate: true,
    },
    email: {
      value: selectedUser?.email || "",
      valid: selectedUser?.email ? true : false,
      touched: false,
      regexCheck: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      shouldValidate: true,
    },
    dateOfEmployment: {
      value: selectedUser?.dateOfEmployment || null,
      valid: selectedUser?.dateOfEmployment ? true : false,
      touched: false,
      shouldValidate: true,
    },
    calculateBasedOnDateOfEmployment: {
      value: selectedUser
        ? selectedUser.calculateBasedOnDateOfEmployment
        : true,
      valid: true,
      touched: false,
      shouldValidate: true,
    },
    numberOfVacationDays: {
      value: +selectedUser?.numberOfVacationDays || 0,
      valid: true,
      touched: false,
      min: 0,
      max: 30,
      shouldValidate: !selectedUser?.calculateBasedOnDateOfEmployment,
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;

    let calculateBasedOnDateOfEmployment = {
      ...form.calculateBasedOnDateOfEmployment,
    };
    let numberOfVacationDays = { ...form.numberOfVacationDays };

    if (name === "calculateBasedOnDateOfEmployment") {
      calculateBasedOnDateOfEmployment = {
        ...form.calculateBasedOnDateOfEmployment,
        value: checked,
      };

      numberOfVacationDays = {
        ...form.numberOfVacationDays,
        shouldValidate: !checked,
        valid: handleValidate("numberOfVacationDays", value),
      };
    }

    if (name === "numberOfVacationDays") {
      numberOfVacationDays = {
        ...form[name],
        value: +value,
        valid: handleValidate(name, value),
      };
    }

    setForm({
      ...form,
      [name]: {
        ...form[name],
        value,
        valid: handleValidate(name, value),
        touched: true,
      },
      calculateBasedOnDateOfEmployment,
      numberOfVacationDays,
    });
  };

  const handleDatePickerChange = (date) => {
    setForm({
      ...form,
      dateOfEmployment: {
        ...form.dateOfEmployment,
        value: date && formatDateToYYYYMMDD(date),
        valid: handleValidate("dateOfEmployment", date),
        touched: true,
      },
    });
  };

  const handleValidate = (name, value) => {
    if (name === "firstName" || name === "lastName") {
      return value.length >= form[name].minLength;
    }
    if (name === "email") {
      return form.email.regexCheck.test(value);
    }
    if (name === "dateOfEmployment") {
      return value !== null;
    }
    if (name === "numberOfVacationDays") {
      return +value > form[name].min && +value <= form[name].max;
    }

    return true;
  };

  const isDisabled = () => {
    for (const key of Object.keys(form)) {
      if (form[key].shouldValidate && !form[key].valid) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled()) return;

    setLoading(true);

    try {
      if (!selectedUser) {
        await axios.post(
          endpoints.CREATE_NEW_USER,
          JSON.stringify({
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            dateOfEmployment: form.dateOfEmployment.value,
            calculateBasedOnDateOfEmployment:
              form.calculateBasedOnDateOfEmployment.value,
            numberOfVacationDays: form.numberOfVacationDays.value,
          })
        );
      } else {
        await axios.put(
          endpoints.EDIT_USER,
          JSON.stringify({
            userId: selectedUser.id,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            dateOfEmployment: form.dateOfEmployment.value,
            calculateBasedOnDateOfEmployment:
              form.calculateBasedOnDateOfEmployment.value,
            numberOfVacationDays: form.numberOfVacationDays.value,
          })
        );
      }

      setLoading(false);
      closeAction();
      dispatch(getUsers());
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
    <Modal size="lg" fullscreen={"md-down"} show={show} onHide={closeAction}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedUser ? "Edit User" : "Create new User"}
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
                name="firstName"
                label="First name"
                placeholder="Enter first name"
                value={form.firstName.value}
                onChange={handleInputChange}
                error={
                  form.firstName.touched &&
                  !form.firstName.valid &&
                  "The minimum length of this field is 2 characters."
                }
              />

              <CustomInput
                inputType={InputTypes.TEXT}
                name="lastName"
                label="Last name"
                placeholder="Enter last name"
                value={form.lastName.value}
                onChange={handleInputChange}
                error={
                  form.lastName.touched &&
                  !form.lastName.valid &&
                  "The minimum length of this field is 2 characters."
                }
              />

              <CustomInput
                inputType={InputTypes.TEXT}
                name="email"
                label="Email"
                placeholder="Enter email"
                value={form.email.value}
                onChange={handleInputChange}
                error={
                  form.email.touched &&
                  !form.email.valid &&
                  "This field is required and must be in email format."
                }
              />

              <CustomDateInput
                label="Date of employment"
                setLabel={true}
                selectsRange={false}
                selected={form.dateOfEmployment.value}
                onChange={handleDatePickerChange}
                maxDate={new Date()}
              />

              <CustomInput
                inputType={InputTypes.CHECK}
                setLabel={false}
                name="calculateBasedOnDateOfEmployment"
                label="Calculate the number of vacation days based on the employment date"
                placeholder="Enter email"
                checked={form.calculateBasedOnDateOfEmployment.value}
                onChange={handleInputChange}
              />

              {!form.calculateBasedOnDateOfEmployment.value && (
                <CustomInput
                  inputType={InputTypes.TEXT}
                  type="number"
                  min={1}
                  max={30}
                  name="numberOfVacationDays"
                  label="Number of vacation days"
                  placeholder="Enter number of vacation days"
                  value={form.numberOfVacationDays.value}
                  onChange={handleInputChange}
                  error={
                    form.numberOfVacationDays.touched &&
                    !form.numberOfVacationDays.valid &&
                    "Value must be in range between 0 and 30."
                  }
                />
              )}

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
