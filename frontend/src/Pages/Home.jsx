import TopBar from "../Component/TopBar";

const Home = () => {
  return (
    <div className=" flex  bg-bgColor justify-center">
      <div className="  divide-y-2 lg:w-[1200px] 2xl:w-[1680px]">
        <TopBar />
      </div>
    </div>
  );
};

export default Home;
