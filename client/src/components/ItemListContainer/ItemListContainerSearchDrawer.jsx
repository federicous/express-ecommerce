
import ItemList from '../ItemList/ItemList'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
// import { getFirestore } from '../../services/getFirebase';
import { Typography, Box, Pagination, Stack } from '@material-ui/core'
import BusquedaDrawer from '../Busqueda/BusquedaDrawer'
import BusquedaDrawerWhite from '../Busqueda/BusquedaDrawerWhite'
import axios from "axios";
import { useTheme } from '@material-ui/core/styles';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ItemListContainer = () => {
	const theme = useTheme();
	const {patron} = useParams()
	// let patron = "wemb"

	const [products, setProducts] = useState([])
	const [page, setPage] = React.useState(1);
	let pageSize = 12;
	const [pagesCant, setPagesCant] = useState(10)

	const handleChange = (event, value) => {
		setPage(value);
	      };
	      
	const token = cookies.get("token");

	useEffect(() => {
		console.log("entro al search drawer");
		let cancel = false;
		const configuration = {
			method: "get",
			url: `/api/search/${patron}?page=${page}&pageSize=${pageSize}`,
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		      };
		      // make the API call
		      axios(configuration)
			.then((result) => {
				if (cancel) return;
				setProducts([...result.data.allProducts])
				setPagesCant(Math.ceil(result.data.total/pageSize))
			})
			.catch((error) => {
			  error = new Error();
			})
			return () => { 
				cancel = true;
			      }
	}, [patron, page])
	
	return (
		<>
		{/* <Typography variant='h5'>Busqueda: "{patron}"</Typography> */}
		{theme.palette.mode == "dark" ? <BusquedaDrawer/> : <BusquedaDrawerWhite/>
		}
			<ItemList products={products} />
			<Box sx={{my:2}}>
				<Stack spacing={2}>
					{/* <Typography>Page: {page}</Typography> */}
					<Pagination count={pagesCant} page={page} onChange={handleChange} />
				</Stack>
      			</Box>		
		</>
	)
}

export default ItemListContainer
