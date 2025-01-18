import { useEffect } from "react";
import {
  Button,
  Col,
  Container,
  ListGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router";

import { getMeUser } from "../../redux/reducers/me";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import {
  formatDateToDMMMMYYYY,
  formatDateToDMYYYY,
} from "../../shared/helpers";
import { LoadingSpinner } from "../shared/loading-spinner";

export const HomePageUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading } = useAppSelector((state) => state.me);

  useEffect(() => {
    dispatch(getMeUser());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Stack gap={3}>
            <Row className="mb-2">
              <Col sm={12} md={6}>
                <h2>
                  Hello {user?.firstName} {user?.lastName}
                </h2>
                <p>
                  Employed at{" "}
                  <b>{formatDateToDMMMMYYYY(user?.dateOfEmployment)}</b>
                </p>
              </Col>
              <Col
                sm={12}
                md={6}
                className="d-flex justify-content-md-end align-items-start"
              >
                <Button onClick={() => navigate(routes.CREATE_NEW_REQUEST)}>
                  Request day off
                </Button>
              </Col>
            </Row>
            <ListGroup className="mb-2">
              <ListGroup.Item className="text-center">
                VACATION: used <b>{user?.numberOfUsedVacationDays}</b> of{" "}
                <b>{user?.numberOfVacationDays}</b> days
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                SICK LEAVES: <b>{user?.numberOfUsedSickLeaveDays}</b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                PAID LEAVES:{" "}
                <b>
                  {user?.numberOfUsedPaidLeaveDays}{" "}
                  {user?.numberOfUsedPaidLeaveFromManageEaseDays > 0 &&
                    `(${user?.numberOfUsedPaidLeaveFromManageEaseDays} from ManageEase)`}
                </b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                UNPAID LEAVES: <b>{user?.numberOfUsedUnpaidLeaveDays}</b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                ACTIVE REQUESTS: <b>{user?.numberOfDayOffRequests}</b>
              </ListGroup.Item>
            </ListGroup>
          </Stack>
          <Container>
            <h5 className="mt-4 mb-4">
              My days off in current month ({user?.upcomingDaysOff?.length})
            </h5>
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
                {user?.upcomingDaysOff?.map((el, index) => {
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
          </Container>
        </>
      )}
    </>
  );
};
