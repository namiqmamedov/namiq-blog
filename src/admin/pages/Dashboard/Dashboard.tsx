import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useBlogs from '../../../hooks/useBlogs';
import { TableRow, TableCell, Button, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import AppPagination from '../../../components/UI/AppPagination/AppPagination';
import { removeBlog, setPageNumber } from '../../../store/slice/blogSlice';
import { useAppDispatch } from '../../../store/configureStore';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {Blog}  from '../../../models/blog';
import agent from '../../../api/agent';
import BlogForm from '../../components/BlogForm/BlogForm';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthorizationHeader, getTimeAgo } from '../../../util/util';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to={'/admin/dashboard'} color="inherit">
        Namiq
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Dashboard() {
  const {blogs,metaData,tags} = useBlogs();
  const [editMode,setEditMode] = useState(false)
  const dispatch = useAppDispatch();
  const [selectedBlog, setSelectedBlog] = useState<Blog | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  const tagNamesAndIDs: { id: string, name: string }[] = Object.values(tags).map((tag: any) => ({
    id: tag.tagID,
    name: tag.tagName
  }));

  const tagIDToNameMapping: { [key: number]: string } = {};
  tagNamesAndIDs.forEach(item => {
      tagIDToNameMapping[parseInt(item.id)] = item.name;
  });

  function handleSelectBlog(blog: Blog) {
    setSelectedBlog(blog);
    setEditMode(true);
  }
  

  function handleDeleteBlog(id: number) {
    const authorizationHeader = getAuthorizationHeader();
    
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteBlog(id,authorizationHeader)
      .then(() => dispatch(removeBlog(id)))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedBlog) setSelectedBlog(undefined);
    setEditMode(false);
  }

  if (editMode) {
    const selectedCategoryID = selectedBlog?.categoryID || null;

    const selectedTagIDs = selectedBlog?.blogTags.map(tag => tag.tagID) || [];

    return (
        <BlogForm
            blog={selectedBlog}
            categoryName={selectedBlog?.categoryName || ''}
            tagName={selectedBlog?.tagName || ''}
            cancelEdit={cancelEdit}
            selectedCategoryID={selectedCategoryID !== null ? [selectedCategoryID] : []}
            selectedTagIDs={selectedTagIDs}
        />
    );
}
const user = localStorage.getItem('user');

if (!user) {
  // If user is not authenticated, you may want to show a login page or redirect
  // You can replace this with the appropriate logic for your application
  return (
    <Container>
      <Typography variant="h4">Please log in to view this page</Typography>
    </Container>
  );
}

  return (
          <Container sx={{ mt: 4, mb: 4, maxWidth: '94% !important' }}>
            <Grid className='!flex-col' container spacing={3}>
            <Box display='flex' justifyContent='space-between'>
                <Typography className='h4-base' sx={{ p: 2 }} variant='h4'>Blog</Typography>
                <Button onClick={() => setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell width={'33%'} align="left">Name</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell width={'14%'} align="center">Tag</TableCell>
                            <TableCell align="center">Comment</TableCell>
                            <TableCell align="center">Created At</TableCell>
                            <TableCell align="center">Settings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
              {blogs.map((blog,index) => {

            const currentPage = metaData!!.currentPage;
            const pageSize = metaData!!.pageSize;

            const startNumber = (currentPage - 1) * pageSize + index + 1;

            const handleClick = () => {
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDeleteBlog(blog.id)
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  )
                }
              })
            }

            return (
                  <TableRow
                    key={blog.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                        {startNumber}
                    </TableCell>
                    <TableCell align="left">
                      <Box display='flex' alignItems='center'>
                        <img width={'21%'} src={blog.pictureUrl} alt={blog.name} style={{ height: 50, marginRight: 20 }} />
                        <span>{blog.name}</span>
                        <p style={{fontSize: "0"}}>{blog.viewCount}</p>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                        {blog?.category?.name}
                    </TableCell>
                    <TableCell align="center">
                      {blog?.blogTags?.length > 0 && (
                        <span>
                          {tagIDToNameMapping[blog.blogTags[0].tagID]}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {blog && blog.comment
                        ? blog.comment.filter(comment => comment.isAccepted).length > 0
                          ? blog.comment.filter(comment => comment.isAccepted).length
                          : 0
                        : 0}
                    </TableCell>
                    <TableCell align="center">
                    {getTimeAgo(blog.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleSelectBlog(blog)} startIcon={<Edit />} />
                      <LoadingButton
                        loading={loading && target === blog.id}
                        onClick={() => handleClick()}
                        startIcon={<Delete />} color='error' />
                    </TableCell>
                  </TableRow>
                );
              })}
                </TableBody>
                </Table>
            </TableContainer>
               {metaData &&  
                  <Box sx={{pt: 2}}>
                      <AppPagination 
                          metaData={metaData} 
                          onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
                  </Box>
               }
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
  );
}