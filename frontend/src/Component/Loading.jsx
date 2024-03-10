import Lottie from "react-lottie";
import loading from "../assets/loading.json";
const Loading = () => {
  return <Lottie height={70} options={{ animationData: loading }}></Lottie>;
};

export default Loading;
