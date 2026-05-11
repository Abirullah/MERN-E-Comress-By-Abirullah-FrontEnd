import { useSelector } from "react-redux";
import { SnakerShoeHome , SkateShoeHome , FootBallShoeHome} from "../utils/HomePageParts";



const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);





  return (
    <div>
      {/* <SnakerShoeHome /> */}
      {/* <SkateShoeHome /> */}
      <FootBallShoeHome />
    </div>
   
  );
};SnakerShoeHome

export default Home;
