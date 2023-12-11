import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const FriendCard = ({ friends }) => {
  return (
    <div className="bg-white rounded-lg p-3">
      <div className="font-bold py-2 border-b-2 border-[lightgray]">
        <span>Friends</span>
      </div>
      <div className="py-3 flex gap-2 flex-col">
        {friends?.map((friend, index) => {
          return (
            <Link key={index} to={`/profile/${friend?._id}`}>
              <div className="flex gap-3 items-center text-xs ">
                <img
                  className="border-black border-2 p-1 rounded-full overflow-hidden w-10"
                  src={friend?.profileUrl ?? NoProfile}
                  alt={friend?.email}
                />
                <div>
                  <div className=" font-bold">
                    {friend?.firstName} {friend?.lastName}
                  </div>
                  <div className="text-[gray]">
                    {friend?.profession ?? "No Profession"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FriendCard;
