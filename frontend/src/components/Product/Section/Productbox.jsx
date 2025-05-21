
import "./Section.css";
import data from "./data.json";

const Productbox = () => {
  return (
    <div className="product-container">
      {/* Sticky Heading */}
    

      {/* Product List */}
      <div className="product-list">
      <div className="newProductbox">
        <h1 className="Productboxheading">Product</h1>
      </div>
        {data.map((product, index) => (
          <div
            key={product.id}
            className={`product-box product-${index}`}
            style={{
              backgroundColor: product.backgroundColor,
              top: product.top , // Default top if missing
            }}
          >
            
            <div className="row">
              {/* Content Section */}
              <div className="col-lg-7">
                <h1>{product.title}</h1>
                <p>{product.description}</p>
                <hr />
                <h1>{product.benefitsTitle}</h1>
                <p>{product.benefitsDescription}</p>
                <ul>
                  {product.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Image Section */}
              <div className="col-lg-5 image-container">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productbox;
