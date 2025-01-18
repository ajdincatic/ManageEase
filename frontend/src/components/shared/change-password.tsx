import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import { logout } from "../../redux/reducers/auth";
import {
  endpoints,
  PASSWORD_MATCH_RULES,
  PASSWORD_RULES,
  routes,
} from "../../shared/constants";
import { useAppDispatch } from "../../shared/custom-hooks";
import { validatePassword } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import { CustomInput, InputTypes } from "./custom-input";
import { LoadingSpinner } from "./loading-spinner";

export const ChangePassword = () => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<MyForm>({
    oldPassword: {
      value: "",
      valid: false,
      touched: false,
    },
    newPassword: {
      value: "",
      valid: false,
      touched: false,
      regexCheck: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    },
    newPasswordConfirmation: {
      value: "",
      valid: false,
      touched: false,
      regexCheck: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: {
        value,
        valid: handleValidate(name, value),
        touched: true,
      },
    });
  };

  const handleValidate = (name, value) => {
    console.log(name, value);
    if (name === "oldPassword") {
      return value.length > 0;
    }
    if (name === "newPassword") {
      return validatePassword(value);
    }
    if (name === "newPasswordConfirmation") {
      return validatePassword(value) && form.newPassword.value === value;
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

    await axios
      .post(
        endpoints.CHANGE_PASSWORD,
        JSON.stringify({
          oldPassword: form.oldPassword.value,
          newPassword: form.newPassword.value,
          newPasswordConfirmation: form.newPasswordConfirmation.value,
        })
      )
      .then(() => {
        setLoading(false);
        dispatch(logout());
      })
      .catch((error: AxiosError) => {
        setError(
          Array.isArray(error.response.data?.["message"])
            ? error.response.data?.["message"].join(" | ")
            : error.response.data?.["message"]
        );

        setLoading(false);

        setTimeout(() => {
          setError(null);
        }, 5000);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="wrapper mb-5 d-flex justify-content-between">
            <h3>
              <Link className="me-2" to={routes.HOME}>
                <IoIosArrowRoundBack className="color-qsd" />
              </Link>
              Change Password
            </h3>
          </div>
          <Form onSubmit={handleSubmit}>
            <CustomInput
              inputType={InputTypes.TEXT}
              type="password"
              name="oldPassword"
              label="Old Password"
              placeholder="Old Password"
              value={form.oldPassword.value}
              onChange={handleInputChange}
              error={
                form.oldPassword.touched &&
                !form.oldPassword.valid &&
                "This field is required."
              }
            />

            <CustomInput
              inputType={InputTypes.TEXT}
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              value={form.newPassword.value}
              onChange={handleInputChange}
              error={
                form.newPassword.touched &&
                !form.newPassword.valid &&
                PASSWORD_RULES
              }
            />

            <CustomInput
              inputType={InputTypes.TEXT}
              type="password"
              name="newPasswordConfirmation"
              label="New Password Confirmation"
              placeholder="New Password Confirmation"
              value={form.newPasswordConfirmation.value}
              onChange={handleInputChange}
              error={
                form.newPasswordConfirmation.touched &&
                !form.newPasswordConfirmation.valid &&
                PASSWORD_MATCH_RULES
              }
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
    </>
  );
};
