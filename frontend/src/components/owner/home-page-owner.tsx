import { useEffect } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

import { getMeUser } from "../../redux/reducers/me";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import {
  formatDateToDMYYYY,
  getEndDateOfNextMonth,
  getStartDateOfPreviousMonth,
} from "../../shared/helpers";
import { LoadingSpinner } from "../shared/loading-spinner";

export const HomePageOwner = () => {
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.me);

  useEffect(() => {
    dispatch(getMeUser());
  }, [dispatch]);

  const renderEventContent = (eventInfo: any) => (
    <>
      <b>{eventInfo.event.title}</b>
      <br />
      <i>{eventInfo.event.extendedProps.type.replaceAll("_", " ")}</i>
    </>
  );

  const setValidRange = () => ({
    start: getStartDateOfPreviousMonth(),
    end: getEndDateOfNextMonth(),
  });

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row>
            <Col lg={6}>
              {user?.numberOfDayOffRequests > 0 ? (
                <Alert key="info" variant="primary">
                  You have {user.numberOfDayOffRequests}{" "}
                  {user.numberOfDayOffRequests === 1 ? "request" : "requests"}{" "}
                  for days off.{" "}
                  <Link to={routes.REQUESTS}>Go to requests page.</Link>
                </Alert>
              ) : (
                <Alert key="info" variant="primary">
                  No day off requests.
                </Alert>
              )}
            </Col>
            <Col lg={6}>
              <Alert
                className="d-flex justify-content-lg-end"
                key="info"
                variant="primary"
              >
                {user?.activeIteration?.name.toUpperCase()} ITERATION (
                {formatDateToDMYYYY(user?.activeIteration?.startDate)} -{" "}
                {formatDateToDMYYYY(user?.activeIteration?.endDate)})
              </Alert>
            </Col>
          </Row>

          <hr />

          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={user?.calendar}
            eventContent={renderEventContent}
            validRange={() => setValidRange()}
          />
        </>
      )}
    </>
  );
};
