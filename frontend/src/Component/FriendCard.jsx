import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { MdVerified } from "react-icons/md";

const FriendCard = ({ friends }) => {
  return (
    <div className="bg-secondary border text-foreground p-3 my-3 rounded-lg">
      <div className="font-bold  border-b-foreground border-b mb-5">
        {" "}
        Friends
      </div>
      {!friends.length > 0 && (
        <div className="text-xs text-center font-light">
          Friend doesn't exist
        </div>
      )}
      <div className="py-3 flex gap-2 flex-col ">
        {friends?.map((friend, index) => {
          return (
            <Link key={index} to={`/profile/${friend?._id}`}>
              <div className="flex gap-3 items-center text-xs ">
                <img
                  className=" p-1 rounded-full overflow-hidden w-10"
                  src={
                    friend?.profileUrl ??
                    `https://api.dicebear.com/7.x/initials/svg?seed=${`${friend?.firstName} ${friend?.lastName}`}`
                  }
                  alt={friend?.email}
                />
                <div>
                  <div className=" font-bold flex gap-3 capitalize items-center">
                    {friend?.firstName} {friend?.lastName}
                    {friend?.verified && (
                      <MdVerified className="text-[purple] text-xl" />
                    )}
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
