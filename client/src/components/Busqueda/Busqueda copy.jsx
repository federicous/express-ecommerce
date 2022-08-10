import {Search as SearchIcon} from '@material-ui/icons';
import { alpha, styled } from "@material-ui/system"; 
import { InputBase } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
	  backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
	  marginLeft: theme.spacing(3),
	  width: 'auto',
	},
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
      }));

      const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
	  padding: theme.spacing(1, 1, 1, 0),
	  // vertical padding + font size from searchIcon
	  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	  transition: theme.transitions.create('width'),
	  width: '100%',
	  [theme.breakpoints.up('md')]: {
	    width: '20ch',
	  },
	},
      }));
      

export default function Busqueda() {

	const [patron, setPatron] = useState("");
	const [filteredResults, setFilteredResults] = useState([]);

	useEffect(() => {
		console.log(filteredResults);
	}, [filteredResults])

	const token = cookies.get("token");

	const handleBusqueda = (event) => {
		// event.preventDefault();
		// setPatron(event.target.value)
		if (event.key === 'Enter') {
			let patron = event.target.value
			// set configurations
			const configuration = {
			method: "get",
			url: `/api/search/${patron}`,
			headers: {
			Authorization: `Bearer ${token}`,
			},		  
			};
		
			// make the API call
			axios(configuration)
			.then((result) => {
				setFilteredResults([result.data])
			})
			.catch((error) => {
			error = new Error();
			})
			// .finally(()=>{setLoading(false)})
		} 
	}

  return (
<Search>
<SearchIconWrapper>
  <SearchIcon />
</SearchIconWrapper>
<StyledInputBase
  placeholder="Search…"
  inputProps={{ 'aria-label': 'search' }}
//   onChange={(e) => handleBusqueda(e)}
//   onChange={handleBusqueda}
//   onSubmit={handleBusqueda}
	onChange={(e)=>setPatron(e.target.value)}
  onKeyDown={handleBusqueda}
/>
</Search>
  )

  }