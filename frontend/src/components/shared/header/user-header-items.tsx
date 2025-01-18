import { Nav } from "react-bootstrap";

import { routes } from "../../../shared/constants";
import styles from "../../styles/header.module.css";

export const UserHeaderItems = ({ navigate }) => (
  <>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.MY_REQUESTS)}
    >
      Day off requests
    </Nav.Link>
    <span className={styles.navItemSpacer}></span>
    <Nav.Link
      className={styles.navItem}
      onClick={() => navigate(routes.MY_DAYS_OFF)}
    >
      Days off
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
