import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import styles from "../styles/styles";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div
            className={`${styles.section} flex bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8`}
          >
            {/* Sidebar */}
            <div className="w-full md:w-[280px] sticky top-20 mt-16 md:mt-0 transition-all duration-300 ease-in-out">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
            {/* Content */}
            <div className="flex-1 ml-0 md:ml-6 transition-all duration-300 ease-in-out">
              <ProfileContent active={active} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
