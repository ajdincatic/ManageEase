import { useState } from "react";
import { Alert, Container, Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { userLogin } from "../../redux/reducers/auth";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { getCurrentYear } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import styles from "../styles/login.module.css";
import { CustomInput, InputTypes } from "./custom-input";
import { LoadingSpinner } from "./loading-spinner";

export const Login = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<MyForm>({
    email: {
      value: "",
      valid: false,
      touched: false,
      regexCheck: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      value: "",
      valid: false,
      touched: false,
    },
  });
  const [error, setError] = useState("");

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

  const handleValidate = (name, value) => {
    if (name === "email") {
      return form.email.regexCheck.test(value);
    }
    if (name === "password") {
      return value.length > 0;
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

    dispatch(
      userLogin({ email: form.email.value, password: form.password.value })
    )
      .unwrap()
      .catch((err) => {
        setError(err?.["message"]);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Container className={styles.container}>
            <div className={styles.loginWrapper}>
              <Image className={styles.img} fluid src="/logo.svg"></Image>
              <Form className={styles.form} onSubmit={handleSubmit}>
                <CustomInput
                  inputType={InputTypes.TEXT}
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  value={form.email.value}
                  onChange={handleInputChange}
                />

                <CustomInput
                  inputType={InputTypes.TEXT}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  value={form.password.value}
                  onChange={handleInputChange}
                />

                <div className="d-grid gap-2">
                  <Button
                    className="mt-1"
                    variant="primary"
                    type="submit"
                    disabled={isDisabled()}
                  >
                    Login
                  </Button>
                </div>
                {error && (
                  <Alert className="mt-3" variant="danger">
                    {error}
                  </Alert>
                )}
              </Form>
              <p className={styles.p}>Copyright &#169; ManageEase</p>
            </div>
          </Container>
        </>
      )}
    </>
  );
};
