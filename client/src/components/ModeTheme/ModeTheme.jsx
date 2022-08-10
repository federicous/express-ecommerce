import * as React from 'react';
import { Box, IconButton } from '@material-ui/core'
// import IconButton from '@mui/material/IconButton';
import { useTheme } from '@material-ui/core/styles';
import { CartContext } from '../CartContext/CartContext';
import { Brightness4, Brightness7 } from '@material-ui/icons';



export default function ModeTheme() {
	const theme = useTheme();
	const cartContext = React.useContext(CartContext);
	const {setModeTheme, modeTheme }= cartContext;

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setModeTheme((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  return (
	<Box
	  sx={{
	    display: 'flex',
	    width: '100%',
	    alignItems: 'center',
	    justifyContent: 'center',
	//     bgcolor: 'background.default',
	// bgcolor:'primary',
	//     color: 'text.primary',
	    color: 'inherit',
	    borderRadius: 1,
	    p: 1,
	  }}
	>
	  {theme.palette.mode} mode
	  <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit" >
	    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
	  </IconButton>
	</Box>
      );
}
