import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  ListGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { deleteDayOff } from "../../redux/reducers/days-off";
import { getUserDetails } from "../../redux/reducers/users";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import {
  formatDateToDMMMMYYYY,
  formatDateToDMYYYY,
} from "../../shared/helpers";
import { AlertModal } from "../shared/alert-modal";
import { LoadingSpinner } from "../shared/loading-spinner";

export const UserDetailsModal = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();

  const { selectedUser, loadingSelectedUser, errorLodaingSelectedUser } =
    useAppSelector((state) => state.users);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDayOff, setSelectedDayOff] = useState(null);

  useEffect(() => {
    dispatch(getUserDetails({ userId: +userId }));
  }, [dispatch, userId]);

  // delete

  const handleShowDeleteModal = (dayOff) => {
    setSelectedDayOff(dayOff);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedDayOff(null);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    handleCloseDeleteModal();
    dispatch(deleteDayOff({ requestId: selectedDayOff.id }))
      .unwrap()
      .then(() => dispatch(getUserDetails({ userId: +userId })));
  };

  return (
    <>
      {showDeleteModal && (
        <AlertModal
          show={showDeleteModal}
          closeAction={handleCloseDeleteModal}
          confirmAction={handleDelete}
          confirmText={"Delete day off"}
          confirmColor={"danger"}
        />
      )}

      {loadingSelectedUser ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <Stack gap={3}>
            <Row className="mb-2">
              <Col sm={12} md={6}>
                <h2>
                  <Link className="me-2" to={routes.USERS}>
                    <IoIosArrowRoundBack className="color-main" />
                  </Link>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </h2>
                <p>
                  Employed at{" "}
                  <b>{formatDateToDMMMMYYYY(selectedUser?.dateOfEmployment)}</b>
                </p>
              </Col>
            </Row>
            <ListGroup className="mb-2">
              <ListGroup.Item className="text-center">
                VACATION: used <b>{selectedUser?.numberOfUsedVacationDays}</b>{" "}
                of <b>{selectedUser?.numberOfVacationDays}</b> days
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                SICK LEAVES: <b>{selectedUser?.numberOfUsedSickLeaveDays}</b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                PAID LEAVES:{" "}
                <b>
                  {selectedUser?.numberOfUsedPaidLeaveDays}{" "}
                  {selectedUser?.numberOfUsedPaidLeaveFromManageEaseDays > 0 &&
                    `(${selectedUser?.numberOfUsedPaidLeaveFromManageEaseDays} from ManageEase)`}
                </b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                UNPAID LEAVES:{" "}
                <b>{selectedUser?.numberOfUsedUnpaidLeaveDays}</b>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                ACTIVE REQUESTS: <b>{selectedUser?.numberOfDayOffRequests}</b>
              </ListGroup.Item>
            </ListGroup>
            <h5 className="my-2">Days off</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Dates</th>
                  <th>Number of days</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser?.upcomingDaysOff?.map((el, index) => {
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
                      <td>
                        {!el.isPassed && !el.isCurrentlyActive ? (
                          <Button
                            className="mx-1"
                            variant="danger"
                            onClick={() => {
                              handleShowDeleteModal(el);
                            }}
                          >
                            Delete
                          </Button>
                        ) : (
                          "Can not perform actions on past or active days off."
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Stack>
          {errorLodaingSelectedUser && (
            <Alert className="mt-3" variant="danger">
              {errorLodaingSelectedUser}
            </Alert>
          )}
        </Container>
      )}
    </>
  );
};
