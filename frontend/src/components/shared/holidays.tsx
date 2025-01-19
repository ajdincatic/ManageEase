import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import { deleteHoliday, getHolidaysList } from "../../redux/reducers/holidays";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { UserType } from "../../shared/enums";
import { formatDateToDMYYYY } from "../../shared/helpers";
import { CreateHolidayModal } from "../owner/create-holiday-modal";
import { AlertModal } from "./alert-modal";
import { LoadingSpinner } from "./loading-spinner";

export const Holidays = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { holidays, loading } = useAppSelector((state) => state.holidays);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    dispatch(getHolidaysList());
  }, [dispatch]);

  // create and edit

  const handleShowCreateModal = (holiday = null) => {
    setSelectedHoliday(holiday);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setSelectedHoliday(null);
    setShowCreateModal(false);
  };

  // delete

  const handleShowDeleteAlert = (holiday) => {
    setSelectedHoliday(holiday);
    setShowDeleteAlert(true);
  };

  const handleCloseDeleteAlert = () => {
    setSelectedHoliday(null);
    setShowDeleteAlert(false);
  };

  const handleDeleteHoliday = () => {
    handleCloseDeleteAlert();
    dispatch(deleteHoliday({ holidayId: selectedHoliday.id }));
    setSelectedHoliday(null);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {showCreateModal && (
            <CreateHolidayModal
              show={showCreateModal}
              closeAction={handleCloseCreateModal}
              selectedHoliday={selectedHoliday}
            />
          )}
          {showDeleteAlert && (
            <AlertModal
              show={showDeleteAlert}
              closeAction={handleCloseDeleteAlert}
              confirmAction={handleDeleteHoliday}
              confirmText={"Delete holiday"}
              confirmColor={"danger"}
            />
          )}
          <Row className="mb-5">
            <Col className="mb-sm-3" sm={12} md={6}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-main" />
                </Link>
                Holidays
              </h3>
            </Col>
            {user?.type === UserType.OWNER && (
              <Col
                sm={12}
                md={6}
                className="d-flex justify-content-md-end align-items-start"
              >
                <Button onClick={() => handleShowCreateModal()}>
                  Create new holiday
                </Button>
              </Col>
            )}
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                {user?.type === UserType.OWNER && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {holidays?.map((el, index) => {
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
                    <td>{el.name}</td>
                    {user?.type === UserType.OWNER && (
                      <td>
                        <Button
                          onClick={() => {
                            handleShowCreateModal(el);
                          }}
                          className="m-1"
                          variant="warning"
                        >
                          Edit
                        </Button>
                        <Button
                          className="m-1"
                          variant="danger"
                          onClick={() => {
                            handleShowDeleteAlert(el);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
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
