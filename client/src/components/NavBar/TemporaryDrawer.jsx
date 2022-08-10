import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  SwipeableDrawer,
} from "@material-ui/core";
import { Menu, ExitToApp, Search, Inbox,ExpandLess, ExpandMore, StarBorder  } from "@material-ui/icons";
import { Box } from "@material-ui/system";
import * as React from "react";
import { Link } from "react-router-dom";
// import { navList } from "../utils/navList";
import LogoutDrawer from "../Logout/LogoutDrawer";
import ModeThemeDrawer from "../ModeTheme/ModeThemeDrawer";
import AccountDrawer from '../Account/AccountDrawer'
import axios from "axios";
import { CartContext } from '../CartContext/CartContext';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");  

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase()
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function TemporaryDrawer() {
  const [navList, setNavList] = React.useState([])
  const cartContext = React.useContext(CartContext);
	const {user}= cartContext;

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    let cancel = false;
    if (cookies.get("user")) {
      const configuration = {
        method: "get",
        url: `/api/categorias/label`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
            };
  
            // make the API call
            axios(configuration)
        .then((result) => {
          if (cancel) return;
          setNavList([...result.data])
        })
        .catch((error) => {
          error = new Error();
        })
        return () => { 
          cancel = true;
        }
    }

  }, [user]);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  let anchor = "left";

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
        <AccountDrawer/>
        </ListItem>
        <Divider />
        <Link to={`/searchDrawer/`} style={{ textDecoration:"none"}}>
        <ListItem
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
            <ListItemIcon>
            <Search sx={{mr:1}}/> Busqueda
            </ListItemIcon>           
        </ListItem>
        <Divider />
        </Link>
          {/* {navList.map((item) => (
            <ListItem key={item} sx={{color:'text.primary'}}
            component={Link}   to={`/category/${item}`} style={{ textDecoration:"none"}}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            >
              {capitalizeFirstLetter(item)}
            </ListItem>
          ))}
        <Divider /> */}

      <ListItem button onClick={handleClick}>
        <ListItemText primary="BREMEN/WEMBLEY" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          {navList.map((item) => (
            <ListItem key={item} sx={{color:'text.primary', ml:2}}
            component={Link}   to={`/category/${item}`} style={{ textDecoration:"none"}}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            >
              {capitalizeFirstLetter(item)}
            </ListItem>
          ))}
        </List>
      </Collapse>
        <Divider />
        <ModeThemeDrawer
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        />
        <Divider />
        <LogoutDrawer
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        />
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={anchor}>
        <Button
          sx={{ color: "white" }}
          onClick={toggleDrawer(anchor, true)}
          size="large"
        >
          <Menu fontSize="large" />
        </Button>
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          {list(anchor)}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
