class Comment {
  constructor(VideoId, userId, name, profileImage, Comment, timestamp) {
    this.name = name;
    this.userPfp = profileImage;
    this.Comment = Comment;
    this.userId = userId;
    this.VideoId = VideoId;
    this.timestamp = timestamp;
  }
}

export default Comment;
