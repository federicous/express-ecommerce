import React, {useContext, useState } from 'react'
import { Button, ButtonGroup, Box, TextField} from '@material-ui/core'
import { AddShoppingCart, Add, Remove } from '@material-ui/icons';
// import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import { Link } from 'react-router-dom'
import { CartContext } from '../CartContext/CartContext';
import Return from '../utils/Return';
import './itemCount.css';


const ItemCount = ({initial, sku, stock, product}) => {

	const cartContext = useContext(CartContext);
	const {addToCart}= cartContext;
	const [contador, setContador] = useState(initial)
	const [visibilty, setVisibilty] = useState(true)
	const [result, setResult] = useState(stock)

	function addItem() {
		if (Number(contador) < Number(result)) {
			setContador(Number(contador)+1)
		}
	}

	function removeItem() {
		if (Number(contador)>1) {
			setContador(Number(contador)-1)		
		}
	}

	function addCart(counter) {
		if (Number(counter)<=Number(stock)) {
			addToCart(product, Number(counter))
			setResult(Number(stock)-Number(counter))
			setContador(Number(initial))
			setVisibilty(false)
		}
	}

	function setContadorFunction(value) {
		if (Number(contador)<Number(stock)) {
			setContador(Number(value))
		} else {
			setContador(Number(stock)-1)
		}

	}

return (
	<>
	{visibilty ? (
		<Box  sx={{ fontSize: 16, mt: 1, width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center", marginX:"5px" }}>
			<ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
				<Button onClick={()=>removeItem()}><Remove/></Button>
				{/* <Box component="span" sx={{ fontSize: 12, display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center" }}>{contador}</Box> */}
				<Box component="div" sx={{ fontSize: 12, display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center",width:"100%" }}>    
					<TextField onChange={(e) => setContadorFunction(e.target.value)} sx={{ width:"45px", input: {textAlign: "center" }}}    id="standard-number"
						type="number"
						value={contador}							
						InputLabelProps={{
						shrink: true,
						}}
						variant="standard"
				/></Box>
				<Button onClick={()=>addItem()}><Add/></Button>
			</ButtonGroup>

			{initial ? (
				<Box>
					<Button size="medium" variant="contained" color="success"  sx={{ fontSize: 12, width:"100%", height:"100%", marginLeft:"5px", textAlign:"center" }}
					onClick={()=>addCart(contador)} ><AddShoppingCart fontSize="small"/> </Button>
				</Box>
			):(
				<Box>
					<Link to={`/`}>
						<Button size="small" variant="contained" color="primary"  sx={{ fontSize: 12, width:"100%" }}
						>Return</Button>
					</Link>	
				</Box>
			)}
		</Box>
		
	):(
		<Box  sx={{ fontSize: 16, mt: 1, width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center" }}>
			<Link to={`/`} style={{ textDecoration:"none", color:"inherit"}}>
				<Button size="small" variant="contained" color="primary"  sx={{ fontSize: 12, width:"100%",  }}
				>Return</Button>
			</Link>	
			<Link to={`/cart`} style={{ textDecoration:"none", color:"inherit"}}>
				<Button size="small" variant="contained" color="primary"  sx={{ fontSize: 12, width:"100%",  }}>Cart</Button>
			</Link>
		</Box>

	)}
	</>
)
}

export default ItemCount