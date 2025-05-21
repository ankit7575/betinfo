import { Link } from "react-router-dom"; // Import Link for navigation
import blogsData from "../../data/blogs.json"; // Import blog data
import "./blog.css"; // Ensure CSS is linked

const BlogSection = () => {
  return (
    <div className="container-fluid">
      <div className="col-lg-10 mx-auto">
        <div className="row" id="sectionpadding">
          {blogsData.map((blog) => (
            
            <div className="col-lg-4" key={blog.id}>
                <Link to={`/blog/${blog.id}`} >
              <div className="blog-card">
                {/* Blog Image */}
                <img src={blog.image} alt={blog.title} className="blog-image" />

                {/* Blog Content */}
                <div className="newpadding">
                  <h1 className="blog-heading">{blog.title}</h1>

                  {/* Trimmed Description (Properly Cutting at Word Boundaries) */}
                  <p className="blog-description">
                    {blog.description.length > 150
                      ? `${blog.description.substring(0, blog.description.lastIndexOf(" ", 150))}...`
                      : blog.description}
                  </p>

                  {/* Read More & Date Row */}
                  <div className="row">
                  <div className="col-lg-6">
                      <div className="blog-date">{blog.date}</div>
                    </div>
                    <div className="col-lg-6">
                      <div className="end">
                      <Link to={`/blog/${blog.id}`} className="read-more">
                        Read More
                      </Link>
                      </div>
                     
                    </div>
                   
                  </div>
                </div>
              </div>
              </Link>
              
            </div>
           
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
