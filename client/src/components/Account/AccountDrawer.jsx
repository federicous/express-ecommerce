import * as React from 'react';
import { Avatar, ListItemIcon } from '@material-ui/core';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const user = cookies.get("user");  

export default function AccountMenu() {

  return (
          <>

              <ListItemIcon sx={{mr:1, minWidth: 28}}>
                <Avatar sx={{ width: 28, height: 28, ml:0 }} />
              </ListItemIcon>
            {user}

    </>

  );
}
