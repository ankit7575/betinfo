
import blogimage from "../../assets/blog/blogimage.png";
import "./blog.css"; // Corrected CSS import

const BlogBanner = () => {
  return (
    <div className="container-fluid" id="blog-background">
   <div className="row" >
    <div className="col-lg-10 mx-auto " id="sectionpadding" >
    <div className="row">
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <h1 className="blog-title">Contact Us</h1>
        </div>
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <img src={blogimage} alt="Blog Banner" />
        </div>
      </div>

    </div>

   </div>
    </div>
  );
};

export default BlogBanner;
