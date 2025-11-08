"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useRef, useState, useEffect } from "react";
import { Progress, Tabs } from "antd";
import About from "./about/page";
import Contact from "@/pages/Contact.jsx";
import Link from "next/link";
import { useLanguage } from "./components/LanguageProvider";

export default function Home() {
  const videoRef = useRef(null);
  const popupVideoRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const { t, isRTL } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);
  const [progress, setProgress] = useState(20);
  const [activeTab, setActiveTab] = useState("2");
  const tabsRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);


  const scrollToSection = (tabKey) => {
    const refs = {
      2: section2Ref,
      3: section3Ref,
    };

    // Update progress based on tab click
    const progressValues = {
      2: 20,
      3: 100,
    };
    setProgress(progressValues[tabKey]);

    const targetRef = refs[tabKey];
    if (targetRef.current) {
      const offsetTop = targetRef.current.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Check if we should make tabs sticky
      const firstSection = section2Ref.current;
      // const lastSection = section4Ref.current;

      let shouldBeSticky = false;

      if (firstSection) {
        const firstSectionTop = firstSection.offsetTop - 120;

        // Make sticky when we reach the first section, hide when scrolling back up
        shouldBeSticky = scrollTop >= firstSectionTop;
      }

      setIsSticky(shouldBeSticky);

      const sections = [
        { id: "2", ref: section2Ref },
        { id: "3", ref: section3Ref },
      ];

      let currentTab = "2";
      let totalProgress = 20;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop - 120;
          const sectionHeight = section.ref.current.offsetHeight;

          if (
            scrollTop >= sectionTop &&
            scrollTop < sectionTop + sectionHeight
          ) {
            currentTab = section.id;
            // Calculate progress within the section
            const sectionProgress = (scrollTop - sectionTop) / sectionHeight;
            // Map to our progress values: 20 -> 100
            const progressValues = [20, 100];
            if (i < progressValues.length - 1) {
              totalProgress =
                progressValues[i] +
                sectionProgress * (progressValues[i + 1] - progressValues[i]);
            } else {
              totalProgress = progressValues[i];
            }
            break;
          } else if (scrollTop >= sectionTop + sectionHeight) {
            // Past this section
            const progressValues = [20, 100];
            totalProgress = progressValues[i];
            currentTab = section.id;
          }
        }
      }

      setActiveTab(currentTab);
      setProgress(Math.min(Math.max(totalProgress, 20), 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWatchTrailer = () => {
    setShowPopup(true);
    setTimeout(() => {
      if (popupVideoRef.current) {
        popupVideoRef.current.play();
      }
    }, 100);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
    }
  };

  return (
    <>
      <div className="relative h-screen">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          poster="/images/main_banner.jpeg"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40 bg-opacity-60"></div>
        {/* <Navbar /> */}
        <div
          className={`absolute bottom-20 max-w-lg ${
            isRTL ? "right-8" : "left-8"
          }`}
        >
          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-yellow-400 text-2xl font-bold mb-4">
              {t("hero_title")}
            </h1>
            <p className="text-cyan-300 text-xl font-semibold mb-4">
              {t("hero_sub_title_1")}
            </p>
            <p className="text-white text-lg">{t("hero_sub_title_2")}</p>
          </div>
          <div
            className={`flex z-20 ${
              isRTL ? "space-x-reverse space-x-4 flex-row-reverse" : "space-x-4"
            }`}
          >
            {/* <Link href="/sessions"> */}
            <button
              onClick={handleWatchTrailer}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 cursor-pointer"
            >
              {t("watch_video")}
            </button>
            {/* </Link> */}
            {/* <button
              onClick={handleWatchTrailer}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 cursor-pointer"
            >
              {t("watch_video")}
            </button> */}
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-end justify-center z-50">
            <div className="relative max-w-4xl w-full mx-4">
              <button
                onClick={closePopup}
                className="absolute -top-8 right-0 text-black hover:text-gray-600 text-xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center leading-none"
              >
                X
              </button>
              <div className="bg-black bg-opacity-40 rounded-t-lg p-4 animate-slide-up">
                <video
                  ref={popupVideoRef}
                  className="w-full h-auto rounded"
                  controls
                  poster="/images/main_banner.jpeg"
                >
                  <source src="/videos/hero_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Progress Bar and Tabs (appear when scrolling) */}
      {isSticky && (
        <>
          <div className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-sm">
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor="#8b5cf6"
            />
          </div>
          <div className="fixed top-[15px] w-full z-[99] bg-white/95 backdrop-blur-sm">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                scrollToSection(key);
              }}
              centered
              items={[
                // { key: "1", label: "Sessions" },
                { key: "2", label: t("about") },
                { key: "3", label: t("contact") },
              ]}
            />
          </div>
        </>
      )}

      {/* Sections */}
      <div className="bg-white">
        {/* Static Progress Bar and Tabs (visible only when not sticky) */}
        {!isSticky && (
          <div ref={tabsRef} className="relative w-full z-20">
            <div className="w-full bg-white/90 backdrop-blur-sm">
              <Progress
                percent={progress}
                showInfo={false}
                strokeColor="#8b5cf6"
              />
            </div>
            <div className="w-full bg-white/95 backdrop-blur-sm">
              <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                  setActiveTab(key);
                  scrollToSection(key);
                }}
                centered
                items={[
                  { key: "2", label: t("about") },
                  { key: "3", label: t("contact") },
                ]}
              />
            </div>
          </div>
        )}
        {/* <section ref={section1Ref} className="min-h-screen p-8 pt-20">
          <h2 className="text-3xl font-bold mb-6">Sessions</h2>
          <p className="text-lg mb-4">
            Discover our transformative consciousness sessions designed to
            unlock your inner potential.
          </p>
          <p className="text-lg mb-4">
            Experience guided meditation sessions, brainwave entrainment, and
            altered state experiences.
          </p>
          <p className="text-lg mb-4">
            Choose from our variety of session types including Alpha, Theta, and
            Delta frequency programs.
          </p>
          <p className="text-lg">
            Join thousands of participants who have experienced profound
            personal growth and enhanced intuition.
          </p>
        </section> */}

        <section
          ref={section2Ref}
          className="min-h-screen p-8  bg-gray-50"
        >
          {/* <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg mb-4">
            We are pioneers in consciousness exploration and brainwave
            entrainment technology.
          </p>
          <p className="text-lg mb-4">
            Our team combines decades of neuroscience research with ancient
            wisdom traditions.
          </p>
          <p className="text-lg mb-4">
            We believe in the power of altered states of consciousness to
            transform lives and unlock human potential.
          </p>
          <p className="text-lg">
            Our mission is to make advanced consciousness techniques accessible
            to everyone seeking personal growth.
          </p> */}
          <About />
        </section>



        <section ref={section3Ref} id="contact-section" className="p-8 pt-20 pb-20 bg-gray-50">
          <Contact />
        </section>
      </div>
    </>
  );
}
