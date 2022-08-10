import React from "react";
import { InputLabel, MenuItem, FormControl, Select, Typography, Button, Box, Menu, Grow, Paper,Popper,MenuList,  Stack, ClickAwayListener  } from "@material-ui/core";
// import { navList } from '../utils/navList';
import { Link } from 'react-router-dom';
import { KeyboardArrowDown } from '@material-ui/icons'
import axios from "axios";
import { CartContext } from '../CartContext/CartContext';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");  

export default function MenuListComposition() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [navList, setNavList] = React.useState([])
  const cartContext = React.useContext(CartContext);
	const {user}= cartContext;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    let cancel = false;
    if (cookies.get("user")) {
      console.log("user dio true");
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
          console.log(result.data);
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

  return (
    <Stack direction="row" spacing={2}>

      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          endIcon={<KeyboardArrowDown />}
          sx={{color:"inherit"}}
        >
          BREMEN / WEMBLEY
        </Button>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {navList.map((item) => (
                      <MenuItem onClick={handleClose} key={item} value={item}  
                      // component={<Link key={item}  to={`/category/${item}`} style={{ textDecoration:"none"}}></Link>}
                      component={Link}   to={`/category/${item}`} style={{ textDecoration:"none"}}
                      >
                        {item}

                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
