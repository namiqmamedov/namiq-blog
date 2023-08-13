import { Container, Grid } from "@mui/material"
import BlogGrid from "../components/UI/BlogGrid/BlogGrid"
import BlogList from "../components/UI/Blog/BlogList"
import useBlogs from "../hooks/useBlogs"
import Loading from "../common/Loading"
import { useDispatch, useSelector } from "react-redux"
import { RootState, useAppSelector } from "../store/configureStore"
import { Fragment, useEffect } from "react"
import { useLocation} from "react-router-dom"
import { fetchBlogsAsync, setBlogParams } from "../store/slice/blogSlice"

const Home = () => {
  const {blogs,filtersLoaded} = useBlogs()
  
  const searchResultsCount = useSelector((state: RootState) => state.blog.searchResultsCount);  
  const hasSubmitted = useSelector((state: RootState) => state.blog.hasSubmitted); // Get hasSubmitted from Redux state
  const totalResults = useAppSelector(state => state.blog.totalResults);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);


  const searchQuery = searchParams.get("q");

  const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1 if not provided

  useEffect(() => {
    if (searchQuery) {
      dispatch(setBlogParams({ searchTerm: searchQuery, pageNumber: page }));
      dispatch(fetchBlogsAsync() as any);
    }
  }, [searchQuery, page, dispatch]);

  if(!filtersLoaded) return <Loading/>

  return (
        <div className='card__item'>
            <Container>
            <div className="mt-4">
            {searchQuery && (
                <p className="text-[22px]">
                    <small>{totalResults} Results for </small> “{searchQuery}”
                </p>
            )}
              </div>
                    <Grid container spacing={2} className="!mt-6" >
                        <Grid item lg={8} sm={12} md={8}>
                        {hasSubmitted && searchResultsCount === 0 && blogs?.length === 0 
                        ? <Fragment>
                            <p className="font-bold text-[32px]">Not found</p>
                            <p>Sorry, but nothing matched your search terms. Please try again with some different keywords.</p>
                        </Fragment>
                        : <BlogList blogs={blogs}
                        /> }
                        </Grid>
                        <Grid item lg={4} sm={12} md={4}>
                            <BlogGrid/>
                        </Grid>
                    </Grid>
            </Container>
        </div>
  )
}

export default Home