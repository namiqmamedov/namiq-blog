import { Fragment } from "react";
import { FaRegComment } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../../store/configureStore";
import { Blog } from "../../../models/blog";
import BlogCardSkeleton from "../BlogCardSkeleton/BlogCardSkeleton";
import AppPagination from "../AppPagination/AppPagination";
import useBlogs from "../../../hooks/useBlogs";
import { setPageNumber } from "../../../store/slice/blogSlice";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { formatBlogName } from "../../../util/util";
import ReactHtmlParser from "react-html-parser";

interface Props {
  blogs?: Blog[];
}

const BlogList = ({blogs}: Props) => {
   const { blogsLoaded, blogParams } = useAppSelector(state => state.blog);
   const {metaData} = useBlogs()
   const dispatch = useAppDispatch();

   const formattedCreatedAt = (date: any) =>
   format(new Date(date), 'MMMM d, yyyy'); 

   return (
     <Fragment>
      {blogs?.map(blog => (
        <Fragment key={blog.id}>
          {!blogsLoaded ? (
            <BlogCardSkeleton/>
          ) : (
            <div className="card border-primary mb-12">
            <div className="card-image">
              <img
                src={blog?.pictureUrl}
                loading="lazy"
                alt="Image"
                className="w-full"
              />
            </div>
            <div className="card-body">
              <div className="mb-4">
                <Link className="text-[24px] !p-0 text-black transition-colors duration-300 hover:!text-[#5f5858]"
                to={`/blog/${formatBlogName(blog?.name)}`}>
                  <h1>{blog.name}</h1>
                </Link>
              </div>
              <div className="post__content flex flex-wrap items-center gap-3">
                <div className="date-wrapper flex items-center gap-1">
                  <BsCalendar2DateFill />
                  <span>{formattedCreatedAt(blog.createdAt)}</span> 
                </div>
                <div className="author-wrapper flex items-center gap-1">
                  <BiSolidUser />
                  <span>admin</span>
                </div>
                <div className="comment-wrapper flex items-center gap-1">
                  <FaRegComment />
                  <span>{blog?.comment?.filter(comment => comment.isAccepted).length}  Comments</span>
                </div>
              </div>
              <p className="card-text mt-4 text-ellipsis overflow-hidden">
              {ReactHtmlParser(
                  blog?.description.text.replace(
                    /(<pre\b[^>]*>[\s\S]*?<\/pre>)/g,
                    '<pre class="d-none">$1</pre>'
                  )
                )}
              </p>
              {blog && (
                <Link
                  to={`/blog/${formatBlogName(blog?.name)}`}
                  onClick={() => {
                    fetch(`${import.meta.env.VITE_API_URL}api/blog/${formatBlogName(blog?.name)}`);
                  }}
                 className="view-btn w-full text-end mt-3 mb-4">
                  <button type="button" className="btn btn-primary hover-back">
                    Read More
                  </button>
                </Link>
              )}
            </div>
          </div>
          )} 
        </Fragment>
      ))}
      {metaData && 
                <AppPagination
                metaData={metaData}
                onPageChange={(page: number) =>
                dispatch(setPageNumber({ pageNumber: page }))}
                searchTerm={blogParams.searchTerm} 
            />}
    </Fragment>
  );
};

export default BlogList;
