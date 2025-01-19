import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { deleteUser, getUsers } from "../../redux/reducers/users";
import { routes } from "../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../shared/custom-hooks";
import { formatDateToDMMMMYYYY } from "../../shared/helpers";
import { User } from "../../shared/interfaces";
import { AlertModal } from "../shared/alert-modal";
import { LoadingSpinner } from "../shared/loading-spinner";
import { CreateUserModal } from "./create-user-modal";

export const Users = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { users, loadingList } = useAppSelector((state) => state.users);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // create and edit

  const handleShowCreateModal = (user = null) => {
    setSelectedUser(user);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setSelectedUser(null);
    setShowCreateModal(false);
  };

  // delete

  const handleShowDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    handleCloseDeleteModal();
    dispatch(deleteUser({ userId: selectedUser.id }));
  };

  return (
    <>
      {loadingList ? (
        <LoadingSpinner />
      ) : (
        <>
          {showCreateModal && (
            <CreateUserModal
              show={showCreateModal}
              closeAction={handleCloseCreateModal}
              selectedUser={selectedUser}
            />
          )}
          {showDeleteModal && (
            <AlertModal
              show={showDeleteModal}
              closeAction={handleCloseDeleteModal}
              confirmAction={handleDelete}
              confirmText={"Delete user"}
              confirmColor={"danger"}
            />
          )}
          <Row className="mb-5 d-flex justify-content-lg-between">
            <Col className="mb-sm-3" md={12} lg={4}>
              <h3>
                <Link className="me-2" to={routes.HOME}>
                  <IoIosArrowRoundBack className="color-main" />
                </Link>
                Users
              </h3>
            </Col>

            <Col lg={8} md={12}>
              <Row className="d-flex justify-content-lg-end">
                <Col sm={12} lg={6} className="d-flex justify-content-lg-end">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="me-2 my-dropdown-button"
                  >
                    Create new user
                  </Button>
                  <Button
                    onClick={() => navigate(routes.CREATE_DAY_OFF)}
                    className="my-dropdown-button"
                  >
                    Create day off
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employed</th>
                <th>Email</th>
                <th>Vacation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {el.firstName} {el.lastName}
                    </td>
                    <td>{formatDateToDMMMMYYYY(el.dateOfEmployment)}</td>
                    <td>{el.email}</td>
                    <td>
                      used {el.numberOfUsedVacationDays} of{" "}
                      {el.numberOfVacationDays} days
                    </td>
                    <td>
                      <Button
                        className="m-1"
                        variant="primary"
                        onClick={() => navigate(`${routes.USERS}/${el.id}`)}
                      >
                        Details
                      </Button>
                      <Button
                        className="m-1"
                        variant="warning"
                        onClick={() => {
                          handleShowCreateModal(el);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="m-1"
                        variant="danger"
                        onClick={() => {
                          handleShowDeleteModal(el);
                        }}
                      >
                        Delete
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
