import React from 'react'
import { Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Paper, Box, CardMedia, Link, Typography, Button } from '@material-ui/core';
import { Link as DomLink } from 'react-router-dom';
import { Delete } from '@material-ui/icons';
import './CartTable.css';
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function ccyFormat(num) {
	return `${num.toFixed(2)}`;
      }

const token = cookies.get("token");

let handleOrden = () => {
  let cancel = false;
  const configuration = {
    method: "post",
    url: `/api/order`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
        };
        // make the API call
        axios(configuration)
    .then((result) => {
      if (cancel) return;
      console.log(result.data);
      // setProducts([...result.data.allProducts])
      // setPagesCant(Math.ceil(result.data.total/pageSize))
    })
    .catch((error) => {
      error = new Error();
    })
    return () => { 
      cancel = true;
    }
}

const CartTable = ({cart, removeFromCart, total, }) => {
	return (
    <>
    <TableContainer component={Paper} sx={{ marginTop: "1rem", flex:'40%' }}>
      <Table className="table" aria-label="spanning table" sx={{pr:"0px"}}>
        <TableHead>
          {/* <TableRow>
            <TableCell align="center" colSpan={4}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell align="center" sx={{pr:"0px"}}>Item</TableCell>
            <TableCell align="center" sx={{pr:"0px"}}></TableCell>
            <TableCell align="center" sx={{pr:"0px"}}>Cant.</TableCell>
            <TableCell align="center" sx={{pr:"0px"}}>P.Unit</TableCell>
            <TableCell align="center">S.Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((row) => (
            <TableRow key={row._id ? row._id : row.id}>
              <TableCell align="right" sx={{pr:"0px"}}
                // sx={{
                //   fontSize: 16,
                //   // mt: 1,
                //   m:0,
                //   p:0,
                //   width: "100%",
                //   display: "flex",
                //   flexDirection: "column",
                //   justifyContent: "left",
                //   alignItems: "center",
                // }}
              >
                 <DomLink to={`/detail/${row._id ? row._id : row.id}`} style={{textDecoration: "none"}}>
                <Box
                  component="span"
                  sx={{
                    fontSize: 12,
                    // m:0,
                    // p:0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign:'center',
                    maxWidth:"250px",
                    margin:"auto"
                  }}
                >
                  <Box>
                  <CardMedia
                    component="img"
                    // image={row.image}
                    image={`http://localhost:8088/images/${row.image}`}
                    alt="notebook"

                    sx={{ height: {xs:60, sm:90}, marginBottom: "1rem" }}
                  />
                  </Box>
                  <Typography sx={{textDecoration: "none", fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} color="text.primary" variant="caption">{row.name} ({row.code})</Typography>                  
                </Box>
                </DomLink>
              </TableCell>
              <TableCell align="center" sx={{pr:"0px"}}>
                <Link sx={{cursor:"pointer", justifyContent:"center"}} onClick={() => removeFromCart(cart.indexOf(row))}>
                  <Button color='error' variant='contained' sx={{minWidth:"fit-content", p:"6px"}}>
                    <Delete />
                  </Button>
                </Link>
              </TableCell>
              <TableCell align="center" sx={{pr:"0px"}}>{row.qty}</TableCell>
              <TableCell align="center" sx={{pr:"0px"}}>{row.price}</TableCell>
              <TableCell align="center">
                {ccyFormat(row.price * row.qty)}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}></TableCell>
            <TableCell colSpan={1}>TOTAL</TableCell>
            <TableCell align="center">{ccyFormat(parseFloat(total))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <Button sx={{my:3}} variant='contained' 
    onClick={handleOrden}
    >
      Enviar orden
    </Button>
    </>
  );
}

export default CartTable