import { useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../../redux/reducers/auth";
import { routes } from "../../../shared/constants";
import { useAppDispatch } from "../../../shared/custom-hooks";
import { UserType } from "../../../shared/enums";
import styles from "../../styles/header.module.css";
import { AlertModal } from "../alert-modal";
import { OwnerHeaderItems } from "./owner-header-items";
import { UserHeaderItems } from "./user-header-items";

export const Header = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavItemClick = (route: string) => {
    navigate(route);
    setExpanded(false);
  };

  return (
    <>
      {showAlertModal && (
        <AlertModal
          show={showAlertModal}
          closeAction={() => setShowAlertModal(false)}
          confirmAction={handleLogout}
          confirmText={"Logout"}
          confirmColor={"danger"}
        />
      )}
      <Navbar
        bg="light"
        expand="lg"
        expanded={expanded}
        className={styles.navbar}
      >
        <Container>
          <Link to={routes.HOME} onClick={() => setExpanded(false)}>
            <Navbar.Brand>
              <img
                src="/logo.svg"
                width="156"
                height="52"
                className="d-inline-block align-top"
                alt="ManageEase"
              />
            </Navbar.Brand>
          </Link>
          {user && (
            <>
              <Navbar.Toggle
                aria-controls="navbarScroll"
                onClick={() => setExpanded(!expanded)}
              />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "250px" }}
                  navbarScroll
                ></Nav>
                <Nav>
                  {user.type === UserType.USER ? (
                    <UserHeaderItems navigate={handleNavItemClick} />
                  ) : (
                    <OwnerHeaderItems navigate={handleNavItemClick} />
                  )}
                  <span className={styles.navItemSpacer}></span>
                  <NavDropdown
                    className={styles.navItem}
                    title={`${user.firstName} ${user.lastName}`}
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => handleNavItemClick(routes.CHANGE_PASSWORD)}
                    >
                      Change password
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => setShowAlertModal(true)}>
                      Log Out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};
