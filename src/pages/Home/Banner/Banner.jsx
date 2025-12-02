// import React from 'react';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import bannerImg1 from '../../../assets/banner/banner1.png';
// import bannerImg2 from '../../../assets/banner/banner2.png';
// import bannerImg3 from '../../../assets/banner/banner3.png';
// import { Carousel } from 'react-responsive-carousel';

// const Banner = () => {
//     return (
//         <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
//             <div>
//                 <img src={bannerImg1} />
//                 <p className="legend">Legend 1</p>
//             </div>
//             <div>
//                 <img src={bannerImg2} />
//                 <p className="legend">Legend 2</p>
//             </div>
//             <div>
//                 <img src={bannerImg3} />
//                 <p className="legend">Legend 3</p>
//             </div>
//         </Carousel>
//     );
// };

// export default Banner;

import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import bannerImg1 from '../../../assets/banner/banner1.png';
import bannerImg2 from '../../../assets/banner/banner2.png';
import bannerImg3 from '../../../assets/banner/banner3.png';
import bannerImg4 from '../../../assets/banner/banner4.png';

const Banner = () => {
    const images = [bannerImg1, bannerImg2, bannerImg3, bannerImg4];

    return (
        <div className="py-5">
            <div className="rounded-2xl overflow-hidden  sm:h-[250px] md:h-[350px] lg:h-[500px] bg-white">
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={true}
                    interval={3500}
                    transitionTime={800}
                >
                    {images.map((img, i) => (
                        <div key={i}>
                            <img
                                src={img}
                                alt={`banner-${i + 1}`}
                                className="w-full  sm:h-[250px] md:h-[350px] lg:h-[500px] object-contain md:object-cover rounded-2xl"
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default Banner;
