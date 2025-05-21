import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import blogsData from "../../data/blogs.json";
import "./singleBlog.css";
import Newsletter from "./Newsletter";

const SingleSection = () => {
  const { id } = useParams();


  const blog = blogsData.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

 
  

  if (!blog) {
    return <h2 className="not-found">Blog Not Found</h2>;
  }

  return (
    <div className="container-fluid" id="sectionpadding">
      <div className="row" >
        <div className="col-lg-9 mx-auto" >
        {blog.image && <img src={blog.image} alt="Blog Banner" className="blog-top-image" />}
<br></br>

{blog.title && <h1 className="blog-main-title">{blog.title}</h1>}
          {blog.description && (
            <p
              className="blog-description"
              dangerouslySetInnerHTML={{
                __html: blog.description.replace(/\n/g, "<br />"),
              }}
            ></p>
          )}
          {blog.image2 && <img src={blog.image2} alt="Blog Content" className="blog-content-image" />}
          {blog.subheading1 && <h2 className="blog-subheading">{blog.subheading1}</h2>}
          {blog.points1 && blog.points1.length > 0 && (
            <ul className="blog-list">
              {blog.points1.map((point, index) => (
                <li key={index}>
                  {point.heading && <h3 className="list-heading">{point.heading}</h3>}
                  {point.text && <p className="list-text">{point.text}</p>}
                </li>
              ))}
            </ul>
          )}
          {blog.subheading2 && <h2 className="blog-subheading">{blog.subheading2}</h2>}
          {blog.points2 && blog.points2.length > 0 && (
            <ul className="blog-list">
              {blog.points2.map((point, index) => (
                <li key={index}>
                  {point.heading && <h3 className="list-heading">{point.heading}</h3>}
                  {point.text && <p className="list-text">{point.text}</p>}
                </li>
              ))}
            </ul>
          )}
          {blog.conclusion && <p className="final-paragraph">{blog.conclusion}</p>}
          <Newsletter />
          <h2 className="related-blogs-heading">Related Articles</h2>
          <div className="row pt-5">
            {blogsData
              .filter((relatedBlog) => relatedBlog.id !== id)
              .slice(0, 2)
              .map((relatedBlog) => (
                <div className="col-lg-6" key={relatedBlog.id}>
                  <Link to={`/blog/${relatedBlog.id}`}>
                    <div className="blog-card">
                      {relatedBlog.image && (
                        <img src={relatedBlog.image} alt={relatedBlog.title} className="blog-image" />
                      )}
                      <div className="newpadding">
                        {relatedBlog.title && <h1 className="blog-heading">{relatedBlog.title}</h1>}
                       
                        <div className="row">
                        <div className="col-lg-6">
                            {relatedBlog.date && <div className="blog-date">{relatedBlog.date}</div>}
                          </div>
                          <div className="col-lg-6">
                            <div className="end" >
                            <Link to={`/blog/${relatedBlog.id}`} className="read-more">
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
    
    </div>
  );
};

export default SingleSection;
