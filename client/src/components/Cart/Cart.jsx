import React, {useContext, useState, useEffect } from 'react'
import {Box, Modal, Typography, useMediaQuery, Button  } from '@material-ui/core';
import { CartContext } from '../CartContext/CartContext';
import CartTable from '../CartTable.jsx/CartTable';
import Form2 from '../Form/Form2';
import { Link } from 'react-router-dom';
import axios from "axios";
// import Return from '../utils/Return';
import Cookies from "universal-cookie";
const cookies = new Cookies();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Cart() {

  const isMobile = useMediaQuery('(max-width:900px)');
  const [open, setOpen] = useState(false);
  const [modalResult, setModalResult] = useState()
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    cleanCart()
  }
	const cartContext = useContext(CartContext);
	const {cart, total, removeFromCart, cleanCart}= cartContext;  


  // get token generated on login

  const token = cookies.get("token");

  const orderGenerate = (event) => {  
    event.preventDefault();
    let data = event.target;
    console.log("target data");
    console.log(data);
    let someProducts = [];
    // set configurations
    const configuration = {
      method: "post",
      url: `/api/order`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data:{data},
    };
  
    // make the API call
    axios(configuration)
      .then((result) => {
        // setProducts([result.data]);
        console.log(result);
      })
      .catch((error) => {
        error = new Error();
      })
      // .finally(()=>{setLoading(false)})
  }
  
  return (
    <>
    <Typography variant={"h5"}>Carrito</Typography>
      {total ? (
        <Box
        // sx={{fontSize: 20, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", margin: "0px", flexWrap:'wrap', width:"100%"}} >
        sx={{fontSize: 20, display: "flex", flexDirection:"column", justifyContent: "space-between", alignItems: "center", margin: "0px", flexWrap:'wrap', width:"100%"}} >
          <CartTable cart={cart} removeFromCart={removeFromCart} total={total}/>
          <Button  onClick={(event)=>orderGenerate(event)}>

          </Button>
          {/* <Form2
           orderGenerate={orderGenerate}
          /> */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thanks for your purchase 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`The order ID is: ${modalResult}`}
          </Typography>
        </Box>
      </Modal>

        </Box>

      ) : (
        <Box sx={{fontSize: 12, display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", margin: "50px",}} >
          <Typography sx={{fontSize: 20, display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", margin: "10px",}} >
            Carrito vacío !!!
          </Typography>
          <Link to={`/`} style={{ textDecoration:"none", color:"inherit"}}>
			    	<Button size="small" variant="contained" color="primary"  sx={{ fontSize: 12, width:"100%",  }}
			    	>Volver</Button>
			    </Link>	
            
        </Box>
      )}
    </>
  );
}