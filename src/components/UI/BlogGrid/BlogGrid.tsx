import { Divider, List, ListItem } from '@mui/material'
import { FaRegComment } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import CategoryList from '../CategoryList/CategoryList'
import useBlogs from '../../../hooks/useBlogs'
import { useAppDispatch, useAppSelector } from '../../../store/configureStore'
import { setBlogParams } from '../../../store/slice/blogSlice'
import TagList from '../TagList/TagList'
import agent from '../../../api/agent'
import { useState, useEffect, Fragment } from 'react'
import { Blog } from '../../../models/blog'
import { Comment } from '../../../models/comment'
import { formatBlogName } from '../../../util/util'
import BlogSearch from '../BlogSearch/BlogSearch'

const BlogGrid = () => {
    const {category,tags} = useBlogs()
    const {blogParams} = useAppSelector(state => state.blog)
    const dispatch = useAppDispatch();
    const [commentsNoFilter, setCommentsNoFilter] = useState<Comment[]>([]); 
    const [blogsNoFilter, setBlogsNoFilter] = useState<Blog[]>([]); 
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);

    useEffect(() => {
      const fetchBlogsNoFilter = async () => {
        try {
          urlParams.delete('category');
          const response = await agent.Blog.listNoFilter();
          setBlogsNoFilter(response);
        } catch (error) {
          console.error('Error fetching blogs without filters:', error);
        }
      };
      
      fetchBlogsNoFilter();
    }, []);
        
    useEffect(() => {
      const fetchCommentsNoFilter = async () => {
        try {
          const response = await agent.Comment.listNoFilter();
          setCommentsNoFilter(response);
        } catch (error) {
          console.error('Error fetching comments without filters:', error);
        }
      };
      
      fetchCommentsNoFilter();
    }, []);


    function generateNewURL(item:any) {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has('category')) {
        urlParams.delete('category')
        navigate(`/blog/${formatBlogName(item?.name)}`);

        window.location.reload();
      }

      if (urlParams.has('tag')) {
        urlParams.delete('tag')
        navigate(`/blog/${formatBlogName(item?.name)}`);

        window.location.reload();

      }
    }

  return (
    <div className="card border-primary mb-3" >
      <div className="card-body">
        
         <BlogSearch />
          <h3 className="text-uppercase text-sm font-bold">Recent Posts</h3>
          <List>
          <ListItem disablePadding className="flex flex-wrap">
            {blogsNoFilter?.slice(-5).reverse().map((item, index) => (
                <Link
                  key={index}
                  className="w-full hover-text"
                  onClick={() => generateNewURL(item)}
                  to={`/blog/${formatBlogName(item?.name)}`}
                >
                  {item.name}
                  {index !== 4 && (
                    <Divider sx={{ mt: '9px', mb: '-10px', opacity: '0.44' }} />
                  )}
                </Link>
            ))}
          </ListItem>
          
          <h3 className="text-uppercase text-sm font-bold mt-5">Latest Comments</h3>
          <ListItem disablePadding className="flex flex-wrap">
            {commentsNoFilter?.filter(comment => comment.isAccepted).slice(-5).reverse().map((item,index) => {
              const blog = blogsNoFilter.find((blog: Blog) => blog.id === item.blogID);
              const blogName = blog ? blog.name : 'Unknown Blog'; 
                  return (
                    <Link 
                    key={index} 
                    onClick={() => generateNewURL(blog)}
                    to={`/blog/${formatBlogName(blog?.name ||'')}`}
                    >
                            <FaRegComment className="mt-1 d-inline-block mr-2"/>
                                <span className='hover-text'>{item.name}</span>
                              <Fragment>
                                  <span className="text-gray-400"> on </span>
                                  <span className='hover-text'>{blogName}</span>
                              </Fragment>    
                              {index !== commentsNoFilter.length - 1 && (
                                <Divider sx={{mt: '6px',mb: '-12px',opacity: '0.44'}}/>
                              )}
                    </Link>
                  )
              })}
          </ListItem>

          <h3 className="text-uppercase text-sm font-bold mt-5">Categories</h3>
          <ListItem disablePadding className="flex flex-wrap categories">
              <CategoryList
                items={category}
                checked={blogParams.category}
                onChange={(items: string[]) => dispatch(setBlogParams({category: items}))}
              />
          </ListItem>
          <h3 className="text-uppercase text-sm font-bold mt-5">Tags</h3>
          <ListItem disablePadding className="flex flex-wrap tags gap-2">
              <TagList
                  items={tags}
                  checked={blogParams.tags}
                  onChange={(items: string[]) => dispatch(setBlogParams({tags: items}))}
              />
          </ListItem>
          </List>
      </div>
    </div>
  )
}

export default BlogGrid