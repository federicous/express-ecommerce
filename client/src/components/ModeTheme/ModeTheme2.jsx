import * as React from 'react';
import { ListItemIcon, MenuItem, ListItem} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles';
import { CartContext } from '../CartContext/CartContext';
import { Brightness4, Brightness7 } from '@material-ui/icons';


export default function ModeTheme() {
	const theme = useTheme();
	const cartContext = React.useContext(CartContext);
	const {setModeTheme }= cartContext;

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setModeTheme((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  return (
	<>
	<MenuItem onClick={colorMode.toggleColorMode} >
		<ListItemIcon>		
			{theme.palette.mode === 'dark' ? <Brightness7 sx={{mr:2}} fontSize="small"/> : <Brightness4 sx={{mr:2}} fontSize="small"/>}
			{theme.palette.mode} mode
		</ListItemIcon>		
	</MenuItem>
	</>
      );
}
