import { MenuItem, ListItemIcon } from "@material-ui/core";
import { ExitToApp } from '@material-ui/icons';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  };

  return (
    <>
      <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
    </>
  );
}
