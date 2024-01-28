import Slider from "../custom components/slider/Slider";
import ShowCategory from "./ShowCategory";
import UserNavBar from "./UserNavBar";

const UserHome = () => {
  return (
    <>
      <UserNavBar />
      <Slider content="newRelease" heading="NEW RELEASES" />
      <Slider content="topDiscount" heading="TOP DISCOUNTS" />
      <ShowCategory />
    </>
  );
};

export default UserHome;
