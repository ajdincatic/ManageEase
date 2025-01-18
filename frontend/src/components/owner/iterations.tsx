import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import {
  activateIteration,
  deleteIteration,
  getIterationsList,
} from "../../redux/reducers/iterations";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { dateFromNow, formatDateToDMYYYY } from "../../shared/helpers";
import { AlertModal } from "../shared/alert-modal";
import { LoadingSpinner } from "../shared/loading-spinner";
import { CreateIterationModal } from "./create-iteration-modal";

export const Iterations = () => {
  const dispatch = useAppDispatch();

  const { iterations, loading } = useAppSelector((state) => state.iterations);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIteration, setSelectedIteration] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    dispatch(getIterationsList());
  }, [dispatch]);

  const handleActivation = () => {
    dispatch(activateIteration({ iterationId: selectedIteration.id }));
    setShowActivateModal(false);
  };

  // create and edit

  const handleShowCreateModal = (iteration = null) => {
    setSelectedIteration(iteration);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setSelectedIteration(null);
    setShowCreateModal(false);
  };

  // activation

  const handleShowActivateModal = (iterations) => {
    setSelectedIteration(iterations);
    setShowActivateModal(true);
  };

  const handleCloseActivateModal = () => {
    setSelectedIteration(null);
    setShowActivateModal(false);
  };

  // delete

  const handleShowDeleteAlert = (iteration) => {
    setSelectedIteration(iteration);
    setShowDeleteAlert(true);
  };

  const handleCloseDeleteAlert = () => {
    setSelectedIteration(null);
    setShowDeleteAlert(false);
  };

  const handleDeleteHoliday = () => {
    handleCloseDeleteAlert();
    dispatch(deleteIteration({ iterationId: selectedIteration.id }));
    setSelectedIteration(null);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {showCreateModal && (
            <CreateIterationModal
              show={showCreateModal}
              closeAction={handleCloseCreateModal}
              selectedIteration={selectedIteration}
            />
          )}
          {showActivateModal && (
            <AlertModal
              show={showActivateModal}
              closeAction={handleCloseActivateModal}
              confirmAction={handleActivation}
              confirmText={"Activate iteration"}
              confirmColor={"success"}
            />
          )}
          {showDeleteAlert && (
            <AlertModal
              show={showDeleteAlert}
              closeAction={handleCloseDeleteAlert}
              confirmAction={handleDeleteHoliday}
              confirmText={"Delete iteration"}
              confirmColor={"danger"}
            />
          )}
          <Row className="mb-5">
            <Col className="mb-sm-3" sm={12} md={6}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-qsd" />
                </Link>
                Iterations
              </h3>
            </Col>
            <Col
              sm={12}
              md={6}
              className="d-flex justify-content-md-end align-items-start"
            >
              <Button onClick={() => handleShowCreateModal()}>
                Create new iteration
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {iterations?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{dateFromNow(el.createdAt)}</td>
                    <td>{el.name}</td>
                    <td>
                      {formatDateToDMYYYY(el.startDate)} -{" "}
                      {formatDateToDMYYYY(el.endDate)}
                    </td>
                    <td>
                      {!el.isActive ? (
                        <>
                          <Button
                            className="m-1"
                            onClick={() => {
                              handleShowCreateModal(el);
                            }}
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
                        </>
                      ) : (
                        "Can not perform actions on active iteration."
                      )}
                    </td>
                    <td>
                      {el.isActive ? (
                        <span style={{ color: "green", fontWeight: "600" }}>
                          ACTIVE
                        </span>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => handleShowActivateModal(el)}
                        >
                          Make active
                        </Button>
                      )}
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
