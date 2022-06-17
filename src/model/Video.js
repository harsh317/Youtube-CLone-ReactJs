class Video {
  constructor(
    id,
    OwnerId,
    name,
    thumbnail,
    description,
    duration,
    views,
    category,
    publicity,
    filepath,
    Usersname,
    Userpfp,
    timestamp,
    comments,
    likes,
    dislikes
  ) {
    this.id = id;
    this.name = name;
    this.OwnerId = OwnerId;
    this.thumbnail = thumbnail;
    this.description = description;
    this.duration = duration;
    this.views = views;
    this.category = category;
    this.publicity = publicity;
    this.filepath = filepath;
    this.Usersname = Usersname;
    this.Userpfp = Userpfp;
    this.timestamp = timestamp;
    this.comments = comments;
    this.likes = likes;
    this.dislikes = dislikes;
  }
}

export default Video;
