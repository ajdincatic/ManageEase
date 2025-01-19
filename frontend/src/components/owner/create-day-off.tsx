import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { getHolidaysList } from "../../redux/reducers/holidays";
import { getActiveIteration } from "../../redux/reducers/iterations";
import { getUsers } from "../../redux/reducers/users";
import { endpoints, routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { DayOffType } from "../../shared/enums";
import { getDateArrayFromRange } from "../../shared/helpers";
import { MyForm } from "../../shared/interfaces";
import { CustomDateInput } from "../shared/custom-date-input";
import { CustomInput, InputTypes, SelectInput } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const CreateDayOff = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { activeIteration } = useAppSelector((state) => state.iterations);
  const [highlitedDates, setHighlitedDates] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState<MyForm>({
    userId: {
      value: "-1",
      valid: false,
      touched: false,
    },
    type: {
      value: DayOffType.VACATION,
      valid: true,
      touched: true,
    },
    dates: {
      value: [],
      valid: false,
      touched: false,
    },
    description: {
      value: "",
      valid: true,
      touched: false,
      maxLength: 50,
    },
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectsRange, setSelectsRange] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getActiveIteration());
    dispatch(getUsers())
      .unwrap()
      .then((res) => {
        const users: SelectInput[] = [];
        users.push({
          key: "-1",
          value: `-- Select user --`,
        });

        for (const el of res) {
          users.push({
            key: el.id,
            value: `${el.firstName} ${el.lastName}`,
          });
        }
        setUsers(users);
      });
    dispatch(getHolidaysList())
      .unwrap()
      .then((res) => {
        const dates = [];
        for (const el of res) {
          for (const date of el.dates) {
            dates.push(new Date(date));
          }
        }
        setHighlitedDates(dates);
      });
  }, [dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    let dates = { ...form.dates };
    if (name === "type") {
      if (value === DayOffType.VACATION) {
        setSelectsRange(true);
      } else {
        setSelectsRange(false);
      }

      setStartDate(null);
      setEndDate(null);
      dates = {
        ...form.dates,
        value: [],
        valid: false,
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
      dates,
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
    if (name === "userId") {
      return value !== "-1";
    }
    if (name === "type") {
      return Object.values(DayOffType).includes(value);
    }
    if (name === "dates") {
      if (form.type.value === DayOffType.VACATION) {
        return value >= 1;
      } else {
        return value === 1;
      }
    }
    if (name === "description") {
      return value.length < form[name].maxLength;
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
        endpoints.CREATE_NEW_DAY_OFF,
        JSON.stringify({
          userId: +form.userId.value,
          type: form.type.value,
          description: form.description.value,
          dates: form.dates.value,
        })
      )
      .then(() => {
        setLoading(false);

        navigate(routes.HOME);
      })
      .catch((error: AxiosError) => {
        setLoading(false);

        setError(
          Array.isArray(error.response.data?.["message"])
            ? error.response.data?.["message"].join(" | ")
            : error.response.data?.["message"]
        );

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
                <IoIosArrowRoundBack className="color-main" />
              </Link>
              Create day off for user
            </h3>
          </div>
          <Form onSubmit={handleSubmit}>
            <CustomInput
              inputType={InputTypes.SELECT}
              name="userId"
              label="Select user"
              defaultValue={form.userId.value}
              onChange={handleInputChange}
              optionValues={users}
            />

            <CustomInput
              inputType={InputTypes.SELECT}
              name="type"
              label="Type"
              defaultValue={form.type.value}
              onChange={handleInputChange}
              optionValues={[
                DayOffType.VACATION,
                DayOffType.SICK_LEAVE,
                DayOffType.PAID_LEAVE,
                DayOffType.UNPAID_LEAVE,
                DayOffType.PAID_LEAVE_FROM_COMPANY,
              ]}
            />

            <CustomDateInput
              selectsRange={selectsRange}
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              minDate={activeIteration?.startDate}
              maxDate={activeIteration?.endDate}
              onChange={handleDatePickerChange}
              highlightDates={highlitedDates}
            />

            <CustomInput
              inputType={InputTypes.TEXT}
              name="description"
              label="Description"
              placeholder="Enter description"
              value={form.description.value}
              onChange={handleInputChange}
              error={
                form.description.touched &&
                !form.description.valid &&
                "The maximum length of this field is 50 characters."
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
