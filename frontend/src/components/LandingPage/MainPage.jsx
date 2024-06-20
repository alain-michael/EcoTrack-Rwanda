import React, { useState, useEffect } from "react";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import TurnSlightRight from "@mui/icons-material/TurnSlightRight";
import Recycling from "@mui/icons-material/Recycling";
import Person2Outlined from "@mui/icons-material/Person2Outlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import MoneyOutlined from "@mui/icons-material/MoneyOutlined";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import FacebookOutlined from "@mui/icons-material/FacebookOutlined";
import WhatsApp from "@mui/icons-material/WhatsApp";
import Instagram from "@mui/icons-material/Instagram";
import Twitter from "@mui/icons-material/Twitter";
import { getStats } from "../../api/front";

import Navbar from "../sharedComponents/Navbar";
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

  const image2 = "/tdzR5OzaSHif4tBXBtoXyg.webp";

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
      <div className="landing-page min-h-full w-full flex justify-center items-center relative py-12  lg:py-0 md:px-12 xl:px-0">
        {/* Single Slider for hero section */}
        <div className="bg"></div>
        <div className="flex min-h-full h-auto  lg:h-full w-full mt-12 flex-col justify-between lg:flex-row gap-12 lg:gap-24 items-center max-w-[1200px] landing-section">
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
      <div className="flex justify-center px-12 bg-green-900 py-24 lg:pt-60">
        <div className="flex flex-col justify-between  max-w-[1200px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 w-full gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <div className="flex gap-8">
                <div className="font-extrabold text-gray-900  text-2xl pb-12 text-center lg:text-left lg:pb-0 lg:text-3xl lg:-mt-24">
                  <span className="text-white block">How it works</span>{" "}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 flex flex-col gap-8">
              <div className="flex gap-4">
                <Person2Outlined
                  fontSize="xl"
                  sx={{ fontSize: 30 }}
                  className="text-green-900"
                />
                <p className="font-bold text-lg text-gray-900">Sign up</p>
              </div>
              <div className="text-sm text-gray-500">
                Get an account as a householder, to get Started
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 flex flex-col gap-8 lg:-mt-8">
              <div className="flex gap-4">
                <CalendarMonthOutlined
                  fontSize="xl"
                  sx={{ fontSize: 30 }}
                  className="text-green-900"
                />
                <p className="font-bold text-lg text-gray-900">
                  Schedule a day
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Schedule day and time when you want waste collectors to get at
                your home
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 flex flex-col gap-8 lg:-mt-20">
              <div className="flex gap-4">
                <ShareOutlined
                  fontSize="xl"
                  sx={{ fontSize: 30 }}
                  className="text-green-900"
                />
                <p className="font-bold text-lg text-gray-900">Share code</p>
              </div>
              <div className="text-sm text-gray-500">
                Spread a message about ecoTrack while earning points. You will
                be making your neighbourhood clean at the same time as well
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 flex flex-col gap-8 lg:-mt-32">
              <div className="flex gap-4">
                <MoneyOutlined
                  fontSize="xl"
                  sx={{ fontSize: 30 }}
                  className="text-green-900"
                />
                <p className="font-bold text-lg text-gray-900">Save money</p>
              </div>
              <div className="text-sm text-gray-500">
                Redeem points as a discount for waste collection services.
                <br />
                <br /> Points can be earned in many ways. By creating account,
                sharing your code with others and committedly scheduling
                collections. Can't wait, right!
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <a
              href="/auth"
              className="p-3 px-4 rounded-md text-green-900 bg-green-50 shadow-2xl border border-gray-100"
              rel="noopener noreferrer"
            >
              Get started
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-12 bg-white py-24">
        <div className="flex flex-col justify-between  max-w-[1200px]">
          <div className="flex gap-12 items-center flex-col md:flex-row">
            <div>
              <div className="flex gap-8 pb-8">
                <CircleOutlined sx={{ fontSize: 25, color: "darkgreen" }} />
                <div className="font-bold text-green-900 text-lg">
                  Our Mission
                </div>
              </div>
              <p className="text-gray-500 text-base">
                To empower communities to engage in sustainable waste management
                practices through innovative technology, education, and
                collaboration. Our mission is to create a cleaner, greener, and
                more sustainable environment by facilitating efficient waste
                collection, promoting recycling, and encouraging responsible
                waste disposal habits
              </p>
            </div>

            <div className="img rounded-xl w-full aspect-square hidden lg:block">
              <img
                src="/about.jpg"
                alt=""
                className="w-full h-full rounded-xl"
              />
            </div>
            <div>
              <div className="flex gap-8 pb-8 md:justify-end pt-12 sm:pt-0">
                <div className="font-bold text-green-900 text-lg">
                  Our vision
                </div>
                <CircleOutlined sx={{ fontSize: 25, color: "darkgreen" }} />
              </div>
              <p className="text-gray-500 text-base md:text-right">
                To become the leading platform for environmental sustainability,
                transforming waste management into a seamless and impactful
                experience for individuals and communities worldwide. We
                envision a future where every community is equipped with the
                tools and knowledge to reduce their environmental footprint,
                contributing to a healthier planet for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-10 ">
        <div className=" max-w-[1200px] p-10 mx-auto w-full flex  gap-8 md:gap-0 md:justify-between items-center  flex-col md:flex-row">
          <div className="flex gap-4">
            <div className="rounded-full border border-green-400 h-12 w-12 flex items-center justify-center">
              <FacebookOutlined sx={{ color: "darkgreen" }} />
            </div>

            <div className="rounded-full border border-green-400 h-12 w-12 flex items-center justify-center">
              <WhatsApp sx={{ color: "darkgreen" }} />
            </div>
            <div className="rounded-full border border-green-400 h-12 w-12 flex items-center justify-center">
              <Twitter sx={{ color: "darkgreen" }} />
            </div>
            <div className="rounded-full border border-green-400 h-12 w-12 flex items-center justify-center">
              <Instagram sx={{ color: "darkgreen" }} />
            </div>
          </div>

          <div className="text-center">
            <a
              href="/auth"
              className="p-3 px-4 rounded-md text-green-900 bg-white border border-gray-100"
              rel="noopener noreferrer"
            >
              Get started
            </a>
          </div>

          <div>&copy; Eco Track Rwanda</div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
