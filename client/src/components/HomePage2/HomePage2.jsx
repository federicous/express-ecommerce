import { useEffect, useState } from "react";
import { Typography, Box, Pagination, Stack  } from "@material-ui/core";
// import { getFirestore } from "../../services/getFirebase";
import ItemList from "../ItemList/ItemList";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function HomePage2() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
	let pageSize = 12;
	const [pagesCant, setPagesCant] = useState(10)

	const handleChange = (event, value) => {
		setPage(value);
	      };
  
  const token = cookies.get("token");

    useEffect(() => {
      let cancel = false;
      const configuration = {
        method: "get",
        url: `/api/products?page=${page}&pageSize=${pageSize}`,
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
    }, [page])

  return (
    <>
    {/* <Typography variant={"h5"}>Categories</Typography> */}
    <Box component="span" 
      sx={{
        display: "flex",
        flexWrap: "wrap", 
        justifyContent: "center",
        alignItems: "center",
        minWidth: 300,
        width: "100%",
        flexDirection: "column",
        marginTop: "2rem",
      }}
    >
      {/* {navList.map((item) => (
        <ImageButton
          focusRipple
          key={item.name}
          style={{
            width: "33%",
          }}
        >
          <Link key={item.id} to={`/category/${item.value}`}>
            <ImageSrc style={{ backgroundImage: `url(${item.image})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {item.name}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </Link>
        </ImageButton>
      ))} */}

{/* {navList.map((item) => (
        <ImageButton
          focusRipple
          key={item.name}
          style={{
            width: "33%",
          }}
        >
          <Link key={item.id} to={`/category/${item.value}`}>
            <ImageSrc style={{ backgroundImage: `url(${item.image})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {item.name}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </Link>
        </ImageButton>
      ))} */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          minWidth: 300,
          width: "100%",
          marginTop: "2rem",
        }}
      >
      </Box> */}
      {/* <Box  sx={{ display: "flex", justifyContent: "center", flexDirection:"column"}}> */}
        <Typography variant={"h5"}>Productos</Typography>
        <ItemList products={products} />
        <Box sx={{my:2}}>
          <Stack spacing={2}>
            {/* <Typography>Page: {page}</Typography> */}
            <Pagination count={pagesCant} page={page} onChange={handleChange} />
          </Stack>
   			</Box>
        {/* <ItemListContainer products={products} /> */}
      {/* </Box> */}
    </Box>
    </>
  );
}
