import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import {
  getMyRequests,
  withdrawMyRequests,
} from "../../redux/reducers/my-requests";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { dateFromNow, formatDateToDMYYYY } from "../../shared/helpers";
import { AlertModal } from "../shared/alert-modal";
import { LoadingSpinner } from "../shared/loading-spinner";

export const MyRequests = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { myRequests, loading } = useAppSelector((state) => state.myRequests);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    dispatch(getMyRequests());
  }, [dispatch]);

  const handleClose = () => {
    setSelectedRequestId(null);
    setShowAlert(false);
  };

  const handleShow = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowAlert(true);
  };

  const handleWithdrawRequest = () => {
    handleClose();
    dispatch(withdrawMyRequests({ requestId: selectedRequestId }));
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
              confirmAction={handleWithdrawRequest}
              confirmText={"Delete request"}
              confirmColor={"danger"}
            />
          )}
          <Row className="mb-5">
            <Col className="mb-sm-3" sm={12} md={6}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-main" />
                </Link>
                My day off requests
              </h3>
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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Created</th>
                <th>Dates</th>
                <th>Number of days</th>
                <th>Type</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myRequests?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{dateFromNow(el.createdAt)}</td>
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
                        variant="danger"
                        onClick={() => {
                          handleShow(el.id);
                        }}
                      >
                        Withdraw
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
