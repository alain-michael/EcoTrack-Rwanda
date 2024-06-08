import React, { useState, useEffect } from 'react';
import Navbar from '../sharedComponents/Navbar';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '@splidejs/react-splide/css/core';

const MainPage = () => {
    const [navBackground, setNavBackground] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            if (isScrolled !== navBackground) {
                setNavBackground(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [navBackground]);

    const image1 = "https://img.pikbest.com/wp/202405/recycle-bin-assorted-waste-on-eco-friendly-backdrop-recycling-symbol-and-3d-rendered-rubbish_9831528.jpg!sw800";
    const image2 = "https://pics.craiyon.com/2024-03-13/tdzR5OzaSHif4tBXBtoXyg.webp";
    const image3 = "https://mir-s3-cdn-cf.behance.net/project_modules/hd/4a257256022977.599fd7cf684fc.gif";
    const image4 = "https://img.freepik.com/premium-photo/photograph-that-emphasizes-recycling-people-collecting-garbage-nature_304010-2915.jpg";

    return (
        <>
            <Navbar isSticky={navBackground} />
            <div className="landing-page">
                {/* Single Slider for hero section */}
                <Splide
                    options={{
                        perPage: 1,
                        autoplay: true,
                        pauseOnHover: false,
                        interval: 3000, // Change slide every 3 seconds
                    }}
                    className="hero-slider"
                >
                    <SplideSlide>
                        <div className="hero-slide" style={{ backgroundImage: `url(${image4})`, height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                            <div className="hero-content flex items-center max-lg:flex-wrap gap-3" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: '#fff', textAlign: 'center', width: '80%', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
                                <div className='w-full'>
                                    <h1 className='max-lg:text-2xl text-3xl'>Welcome to Waste Management System</h1>
                                    <p className='text-sm mt-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis massa nec nulla pharetra tincidunt.</p>
                                </div>
                                {/* Add other information as needed */}
                                <div className="image-slider w-full overflow-hidden">
                                    <Splide
                                        options={{
                                            perPage: 1,
                                            autoplay: true,
                                            pauseOnHover: false,
                                            interval: 1000, // Change slide every 3 seconds
                                        }}
                                    >
                                        <SplideSlide>
                                            <div className="h-96 max-lg:h-full rounded-lg overflow-hidden">
                                                <img className='h-full w-full object-cover' src={image2} alt="Recycle Bin" />
                                            </div>
                                        </SplideSlide>
                                      
                                        <SplideSlide>
                                            <div className="h-96 max-lg:h-full rounded-lg overflow-hidden">
                                                <img className='h-full w-full object-cover' src={image3} alt="Recycling Symbol" />
                                            </div>
                                        </SplideSlide>
                                      
                                        {/* Add more slides as needed */}
                                    </Splide>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>
                    <SplideSlide>
                        <div className="hero-slide" style={{ backgroundImage: `url(${image1})`, height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                            <div className="hero-content flex items-center max-lg:flex-wrap gap-3" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: '#fff', textAlign: 'center', width: '80%', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
                                <div className='w-full'>
                                    <h1 className='max-lg:text-2xl text-3xl'>Welcome to Waste Management System</h1>
                                    <p className='text-sm mt-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis massa nec nulla pharetra tincidunt.</p>
                                </div>
                                {/* Add other information as needed */}
                                <div className="image-slider w-full overflow-hidden">
                                    <Splide
                                        options={{
                                            perPage: 1,
                                            autoplay: true,
                                            pauseOnHover: false,
                                            interval: 1000, // Change slide every 3 seconds
                                        }}
                                    >
                                        <SplideSlide>
                                            <div className="h-96 max-lg:h-full rounded-lg overflow-hidden">
                                                <img className='h-full w-full object-cover' src={image2} alt="Recycle Bin" />
                                            </div>
                                        </SplideSlide>
                                      
                                        <SplideSlide>
                                            <div className="h-96 max-lg:h-full rounded-lg overflow-hidden">
                                                <img className='h-full w-full object-cover' src={image3} alt="Recycling Symbol" />
                                            </div>
                                        </SplideSlide>
                                      
                                        {/* Add more slides as needed */}
                                    </Splide>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>
                    {/* Add more slides as needed */}
                </Splide>
            </div>
        </>
    );
};

export default MainPage;
