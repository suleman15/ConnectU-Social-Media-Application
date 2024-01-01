import Comments from "../Models/commentsModel.js";

export const getComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    const postComments = await Comments.find({ postId }).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    // // // .populate({
    // // //   path: "replies.userId",
    // // //   select: "firstName lastName location profileUrl -password",
    // // // })
    // // // .sort({ _id: -1 });
    console.log(postComments);
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
