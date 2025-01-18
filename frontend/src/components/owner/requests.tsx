import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { getRequests, handleRequest } from "../../redux/reducers/requests";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { RequestHandleType } from "../../shared/enums";
import { dateFromNow, formatDateToDMYYYY } from "../../shared/helpers";
import { AlertModal } from "../shared/alert-modal";
import { LoadingSpinner } from "../shared/loading-spinner";

export const Requests = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { requests, loading } = useAppSelector((state) => state.requests);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);

  const handleClose = () => {
    setSelectedRequestId(null);
    setShowAlert(false);
  };

  const handleShow = (requestId: number, type: RequestHandleType) => {
    setSelectedRequestId(requestId);
    setSelectedType(type);
    setShowAlert(true);
  };

  const handleActionRequest = () => {
    handleClose();
    dispatch(
      handleRequest({ requestId: selectedRequestId, type: selectedType })
    );
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {showAlert && (
            <AlertModal
              show={showAlert}
              closeAction={handleClose}
              confirmAction={handleActionRequest}
              confirmText={
                selectedType === RequestHandleType.APPROVE
                  ? "Approve request"
                  : "Decline request"
              }
              confirmColor={
                selectedType === RequestHandleType.APPROVE
                  ? "success"
                  : "danger"
              }
            />
          )}
          <Row className="mb-5">
            <Col className="mb-sm-3" sm={12} md={6}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-qsd" />
                </Link>
                Day off requests
              </h3>
            </Col>
            <Col
              sm={12}
              md={6}
              className="d-flex justify-content-md-end align-items-start"
            >
              <Button onClick={() => navigate(routes.CREATE_DAY_OFF)}>
                Create day off
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Created</th>
                <th>User</th>
                <th>Dates</th>
                <th>Number of days</th>
                <th>Type</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{dateFromNow(el.createdAt)}</td>
                    <td>{el.name}</td>
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
                      <Button
                        className="m-1"
                        variant="success"
                        onClick={() => {
                          handleShow(el.id, RequestHandleType.APPROVE);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        className="m-1"
                        variant="danger"
                        onClick={() => {
                          handleShow(el.id, RequestHandleType.DECLINE);
                        }}
                      >
                        Decline
                      </Button>
                    </td>
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
