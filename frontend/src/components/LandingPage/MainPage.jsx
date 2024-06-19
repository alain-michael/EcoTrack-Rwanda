import React, { useState, useEffect } from "react";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import TurnSlightRight from "@mui/icons-material/TurnSlightRight";
import Recycling from "@mui/icons-material/Recycling";
import { getStats } from "../../api/front";
import Side from "./Side";

const MainPage = () => {
  const [navBackground, setNavBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== navBackground) {
        setNavBackground(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [navBackground]);

  const image2 =
    "https://pics.craiyon.com/2024-03-13/tdzR5OzaSHif4tBXBtoXyg.webp";

  const image1 = "/waste.png";
  const image3 = "/green.webp";

  const [data, setData] = useState();

  const getStatusCounts = async () => {
    const res = await getStats();
    setData(res || []);
  };
  useEffect(() => {
    getStatusCounts();
  }, []);

  return (
    <>
      {/* <Navbar isSticky={navBackground} /> */}
      <div className="landing-page h-full w-full flex justify-center relative  py-12  lg:py-0 md:px-12 xl:px-0">
        {/* Single Slider for hero section */}
        <div className="bg"></div>
        <div className="flex min-h-full h-full w-full  flex-col justify-between lg:flex-row gap-12 lg:gap-24 items-center max-w-[1200px] landing-section">
          <Side />
          <div className="hidden xl:block">
            <Recycling sx={{ fontSize: 60, color: " darkgreen" }} />
          </div>
          <div className="w-full min-w-96 max-w-[450px]">
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 pb-12 ">
                  <img
                    className="h-full w-full object-cover rounded-md aspect-square"
                    src={image1}
                    alt="Recycle Bin"
                  />
                  <img
                    className="h-full w-full object-cover rounded-md aspect-square"
                    src={image2}
                    alt="Recycle Bin"
                  />
                </div>
              </div>
              <div className="h-full w-full  aspect-rectangle pt-12 mb-12 lg:mb-0 relative">
                <div className="rotate-90 absolute -top-2 -left-4">
                  <TurnSlightRight sx={{ fontSize: 60, color: " darkgreen" }} />
                </div>
                <img
                  className="h-full w-full object-cover rounded-md"
                  src={image3}
                  alt="Recycle Bin"
                />
              </div>
              <div className="mt-12 lg:hidden invisible">hh</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
