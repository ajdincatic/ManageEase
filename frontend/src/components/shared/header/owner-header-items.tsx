import { Nav } from "react-bootstrap";

import { routes } from "../../../shared/constants";
import styles from "../../styles/header.module.css";

export const OwnerHeaderItems = ({ navigate }) => (
  <>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.ITERATIONS)}
    >
      Iterations
    </Nav.Link>
    <span className={styles.navItemSpacer}></span>
    <Nav.Link className={styles.navItem} onClick={() => navigate(routes.USERS)}>
      Users
    </Nav.Link>
    <span className={styles.navItemSpacer}></span>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.DAYS_OFF)}
    >
      Days off
    </Nav.Link>
    <span className={styles.navItemSpacer}></span>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.REQUESTS)}
    >
      Days off requests
    </Nav.Link>
    <span className={styles.navItemSpacer}></span>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.HOLIDAYS)}
    >
      Holidays
    </Nav.Link>
  </>
);
