import * as React from 'react';
import { Pagination,Stack, Typography } from '@material-ui/core/';
// import PaginationItem from '@material-ui/core/PaginationItem';


export default function PaginationControlled() {
  const [page, setPage] = React.useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination count={10} page={page} onChange={handleChange} />
    </Stack>
  );
}
