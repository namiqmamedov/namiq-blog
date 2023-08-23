import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useBlogs from '../../../hooks/useBlogs';
import { useAppDispatch } from '../../../store/configureStore';
import { useState } from 'react';
import {Blog}  from '../../../models/blog';
import { mainListItems } from '../../../admin/components/ListItem/ListItem';
import BlogForm from '../../../admin/components/BlogForm/BlogForm';
import Routers from '../../../routes/Routers';



const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Sidebar() {
  const {tags} = useBlogs();
  const [editMode,setEditMode] = useState(false)
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | undefined>(undefined);

  const tagNamesAndIDs: { id: string, name: string }[] = Object.values(tags).map((tag: any) => ({
    id: tag.tagID,
    name: tag.tagName
  }));

  const tagIDToNameMapping: { [key: number]: string } = {};
  tagNamesAndIDs.forEach(item => {
      tagIDToNameMapping[parseInt(item.id)] = item.name;
  });



  function cancelEdit() {
    if (selectedBlog) setSelectedBlog(undefined);
    setEditMode(false);
  }


  const toggleDrawer = () => {
    setOpen(!open);
  };

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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }} className='app-box'>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', 
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />

        <React.Fragment>
          <Routers />
        </React.Fragment>

        </Box>
      </Box>
    </ThemeProvider>
  );
}