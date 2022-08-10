import React from 'react'
import { Card,CardActions,CardContent,CardMedia,Container,Typography,Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { fontSize } from '@material-ui/system';
import ItemCount2 from '../ItemCount/ItemCount2'

const Item = ({product, name, description, img, stock, model,sku, price}) => {
	return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          paddingY: "20px",
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to={`/detail/${sku}`}>
            <CardMedia component="img" image={`http://localhost:3000/images/${img ? img : "sin_imagen.jpg"}`} alt="sin imagen" />
          </Link>
        </Container>
        <CardContent sx={{ margin: 0,p:{xs:1,md:2} }}>
          <Typography gutterBottom sx={{fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} variant="caption" component="div">
            {name}
          </Typography>
          <Typography gutterBottom sx={{fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} variant="caption" color="text.secondary" component="div">
            {model}
          </Typography>
          <Link to={`/detail/${sku}`}>
            <Typography sx={{fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} variant="caption" color="text.secondary">
              Código: {description}
            </Typography>
            <Typography sx={{ fontWeight: "bold", textDecoration: "none", color:"text.primary" }} variant="h6">
            $ {price}
          </Typography>
          </Link>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography sx={{fontSize:{xs:"xsmall",sm:"small",md:"medium"}}} variant="caption">(Stock: {stock})</Typography>
          <Box>
            {/* <Link to={`/detail/${sku}`} style={{ textDecoration:"none", color:"inherit"}}>
              <Button
                size="medium"
                variant="contained"
                color="success"
                sx={{ fontSize:{xs:"xsmall",sm:"small",md:"medium"}, width: "100%" }}
              >
               <Typography sx={{fontSize:{xs:"xsmall",sm:"small"}}} variant="caption">Detalles</Typography>

              </Button>
            </Link> */}
            <ItemCount2
            product={product}
            initial={1}
            stock={stock}
          />
          </Box>
        </CardActions>
      </Card>
    </>
  );
}

export default Item
