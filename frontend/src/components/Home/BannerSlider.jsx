// BannerSlider.js
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import banner1 from '../../assets/home/banner1.png';
import banner2 from '../../assets/home/banner2.png';
import banner3 from '../../assets/home/banner3.png';
import banner4 from '../../assets/home/banner4.png';
const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true // <-- This enables pause on mouse hover
  };

  const banners = [
    { id: 1, image: banner1, alt: 'Banner 1' },
    { id: 2, image: banner2, alt: 'Banner 2' },
    { id: 3, image: banner3, alt: 'Banner 3' },
        { id: 4, image: banner4, alt: 'Banner 4' },
  ];

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              src={banner.image}
              alt={banner.alt}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
