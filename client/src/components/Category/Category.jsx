import React from "react";
import { InputLabel, MenuItem, FormControl, Select, Typography, Button, Box } from "@material-ui/core";
import { alpha, styled } from "@material-ui/system"; 
import { navList } from '../utils/navList';
import { Link } from 'react-router-dom';


export default function Catetory() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" >
      <InputLabel sx={{color:"inherit"}} >Categorias</InputLabel>
        <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={age}
                    label="Age"
                    onChange={handleChange}
          // value={age}
          // onChange={handleChange}
          // displayEmpty
          // label="Categorias"
          // inputProps={{ 'aria-label': 'Without label' }}
        >
          {/* <MenuItem value="">
          <Typography variant="compliant" component="div" sx={{ flexGrow: 1,textAlign:"left" }}>
            Categorias
          </Typography> 
          </MenuItem> */}
<MenuItem key={"TODAS"} value={"TODAS"} sx={{p:"0px"}} >
<Link to={`/home`} style={{ textDecoration:"none", width:"100%", minHeight:"auto", px:"20px", py:"20px"}}>
  <Box sx={{width:"100%", height:"100%", px:2, py:1}}>
                {/* <Button sx={{ color: "black" }} variant="text"> */}
                <Typography color="primary" variant="compliant" component="div" sx={{ flexGrow: 1,textAlign:"left" }}>
                  TODAS
                  </Typography>
                  <Typography gutterBottom sx={{fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} variant="caption" component="div">
           Todas
          </Typography>
                {/* </Button> */}
                </Box>             
            </Link>
</MenuItem>
        {navList.map((item) => (
          <MenuItem key={item} value={item}>
            <Link to={`/category/${item}`} style={{ textDecoration:"none"}}>
                <Button sx={{ width:"100%", color:"initial" }} variant="text">
                <Typography variant="compliant" component="div" sx={{ flexGrow: 1,textAlign:"left" }}>
                  {item}
                  </Typography>
                </Button>
            </Link>
          </MenuItem>
        ))}
        </Select>

      </FormControl>
    </div>
  );
}
