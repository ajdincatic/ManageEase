import { ExportToCsv } from "export-to-csv-fix-source-map";
import { useEffect, useState } from "react";
import { Col, Dropdown, DropdownButton, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import { getDaysOff } from "../../redux/reducers/days-off";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { DayOffType } from "../../shared/enums";
import {
  formatDateToDMYYYY,
  getEndDateOfCurrentMonth,
  getStartDateOfCurrentMonth,
} from "../../shared/helpers";
import { CustomDateInput } from "../shared/custom-date-input";
import { CustomInput, InputTypes } from "../shared/custom-input";
import { LoadingSpinner } from "../shared/loading-spinner";

export const DaysOff = () => {
  const dispatch = useAppDispatch();

  const { daysOff, loading } = useAppSelector((state) => state.daysOff);
  const [selectedType, setSelectedType] = useState(DayOffType.ALL_TYPES);
  const [startEndDate, setStartEndDate] = useState({
    startDate: getStartDateOfCurrentMonth(),
    endDate: getEndDateOfCurrentMonth(),
  });

  useEffect(() => {
    dispatch(
      getDaysOff({
        type: selectedType === DayOffType.ALL_TYPES ? null : selectedType,
        dateFrom: startEndDate.startDate,
        dateTo: startEndDate.endDate,
      })
    );
  }, [dispatch, startEndDate, selectedType]);

  const handleSelectChange = (event) => {
    let { value } = event.target;

    if (value === DayOffType.ALL_TYPES) value = null;

    setSelectedType(value);
  };

  const handleDateChange = (date, name: "startDate" | "endDate") => {
    let startDate = startEndDate.startDate;
    let endDate = startEndDate.endDate;

    if (name === "startDate") {
      startDate = date;
    } else {
      endDate = date;
    }

    setStartEndDate({
      startDate,
      endDate,
    });
  };

  const onDownload = () => {
    const options = {
      fieldSeparator: ",",
      filename: `Days_off_${formatDateToDMYYYY(
        startEndDate.startDate
      )}-${formatDateToDMYYYY(startEndDate.endDate)}`,
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useTextFile: false,
      useBom: true,
      headers: ["Date", "User", "Type"],
    };

    const csvExporter = new ExportToCsv(options);

    const data = daysOff.map((el) => {
      return {
        date: formatDateToDMYYYY(el.date),
        user: el.name,
        type: el.type.replaceAll("_", " "),
      };
    });
    csvExporter.generateCsv(data);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row className="mb-5 d-flex justify-content-between">
            <Col className="mb-sm-3" lg={4} md={12}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-qsd" />
                </Link>
                Days Off
              </h3>
            </Col>

            <Col lg={8} md={12}>
              <Row>
                <Col lg={3} sm={12}>
                  <CustomDateInput
                    isClearable={false}
                    setLabel={false}
                    selectsRange={false}
                    selected={startEndDate.startDate}
                    maxDate={startEndDate.endDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                  />
                </Col>
                <Col lg={3} sm={12}>
                  <CustomDateInput
                    isClearable={false}
                    setLabel={false}
                    selectsRange={false}
                    selected={startEndDate.endDate}
                    minDate={startEndDate.startDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                  />
                </Col>
                <Col lg={3} sm={12}>
                  <CustomInput
                    inputType={InputTypes.SELECT}
                    name="type"
                    defaultValue={selectedType}
                    onChange={handleSelectChange}
                    optionValues={Object.keys(DayOffType)}
                  />
                </Col>
                <Col lg={3} sm={12}>
                  <DropdownButton
                    className="my-dropdown-button"
                    title="Export as"
                  >
                    <Dropdown.Item onClick={onDownload}>.xls</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {daysOff?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{formatDateToDMYYYY(el.date)}</td>
                    <td>{el.name}</td>
                    <td>{el.type.replaceAll("_", " ")}</td>
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
