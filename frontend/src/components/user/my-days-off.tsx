import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import { getMyDaysOff } from "../../redux/reducers/my-days-off";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { DayOffType } from "../../shared/enums";
import { formatDateToDMYYYY } from "../../shared/helpers";
import { CustomInput, InputTypes } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const MyDaysOff = () => {
  const dispatch = useAppDispatch();

  const { myDaysOff, loading } = useAppSelector((state) => state.myDaysOff);
  const [selectedType, setSelectedType] = useState(DayOffType.ALL_TYPES);

  useEffect(() => {
    dispatch(getMyDaysOff(null));
  }, [dispatch]);

  const handleSelectChange = (event) => {
    let { value } = event.target;

    if (value === DayOffType.ALL_TYPES) value = null;

    setSelectedType(value);

    dispatch(getMyDaysOff({ type: value }));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row className="mb-5">
            <Col className="mb-sm-3" sm={12} md={6}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-main" />
                </Link>
                My days Off
              </h3>
            </Col>
            <Col
              sm={12}
              md={6}
              className="d-flex justify-content-md-end align-items-start"
            >
              <CustomInput
                inputType={InputTypes.SELECT}
                name="type"
                defaultValue={selectedType}
                onChange={handleSelectChange}
                optionValues={Object.keys(DayOffType)}
              />
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Dates</th>
                <th>Number of days</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {myDaysOff?.map((el, index) => {
                return (
                  <tr
                    className={
                      el.isPassed
                        ? "bg-danger-custom"
                        : el.isCurrentlyActive
                        ? "bg-success-custom"
                        : ""
                    }
                    key={index}
                  >
                    <td>
                      {formatDateToDMYYYY(el.dates[0])} -{" "}
                      {formatDateToDMYYYY(
                        el.dates[el.numberOfSelectedDays - 1]
                      )}
                    </td>
                    <td>{el.numberOfSelectedDays}</td>
                    <td>{el.type.replaceAll("_", " ")}</td>
                    <td>{el.description || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};
