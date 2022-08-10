import { Alert, Button, TextField } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Form2({orderGenerate}) {
  const { register, handleSubmit } = useForm();
  const [emailError, setEmailError] = useState(false)
  const onSubmit = data => {
	  if (data.email === data.email2){
		  orderGenerate(data)
		  setEmailError(false)
	  } else{
		  setEmailError(true)
	  }
	};
   
  return (
	<form onSubmit={handleSubmit(onSubmit)}>  
		<Box 	sx={{
			margin: '5vw',
			flex:'30%',
			flexGrow:'grow',
			display: 'flex',
			flexDirection: "column",
			justifyContent: 'center',
			alignItems: 'center',
			'& > :not(style)': { m: 1 },
		}}
		>
			<TextField  id="outlined-name" label="Name" {...register("firstName", { required: true, pattern: /^[A-Za-z]+$/i })} />
			<TextField  id="outlined-name" label="LastName" {...register("lastName", {  required: true, pattern: /^[A-Za-z]+$/i })} />
			<TextField  id="outlined-name" label="Phone" type="phone" {...register("phone", { required: true,  pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g })} />
			<TextField  id="outlined-name" label="Email" type="email" {...register("email", { required: true })} />
			<TextField  id="outlined-name" label="Email2" type="email" {...register("email2", { required: true})} />
			<Button type="submit" color="primary" size="small" variant="contained">Purchase</Button>
			{emailError? (
				<Alert severity="warning">The email addresses are different</Alert>
			):(
			<></>	
			)}
		</Box>
    	</form>
  );
}
