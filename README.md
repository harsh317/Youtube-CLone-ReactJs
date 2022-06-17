# Getting Started with Create React App

https://user-images.githubusercontent.com/66161239/174223153-c614acd5-0af5-4305-b1fb-03d7de39e455.mp4

An exact clone of youtube with all functionalities from View count to Subscribe to everything (Without Youtube Api) Using Firebase, FFmpeg, And React

As seen from the video, You Can probably tell that UI is not too bad too, In the project I tried to focus on every part (as it was my 1st coding project after a long time). I made the app fully responsive, Animations can be seen, And Here are the additional features I forgor to tell in the video:

# Features
1. Animation And Ui
2. **And Good Authentication System (Forgot password, Reset Password, Email Verification System)** For eg You can pass a `emailVerified` property in your `ProtectedRoute` Component something like this on any page you want:

![1_Ys-Kn04qpvt4I7On8M0wWQ](https://user-images.githubusercontent.com/66161239/174223638-f785044b-743c-4ad2-a30c-a44d8b38f03b.png)

3. **View Count System Based On your Ip**: Views are counted per 1 IP. So, that doesn’t result in an extra view when you refresh Your page. You can use any library/api to get Ip but I am using the following Api:

![1_r_2dOetJIxAHBlQnI4w6ng](https://user-images.githubusercontent.com/66161239/174223856-933c6d37-6d62-40b3-a41a-c6bbb115fd7d.png)

4. **Search Functionality** (You can Search Videos on the header based on a video’s title (Not tags) )
5. **Get Related Videos Based On Tags**(The Related Side videos on the watch screen and on the home screen are fetched based on the tags you upload when you upload a video…)
6. **Publicity Functionality** (Make Your video Public or Private (You can edit it later too) )
7. **Subscribe Your Favorite Creator and Like/Dislike and Comment Functionality** (quite self-explanatory bruh)
8. **An Video Owner Can edit his Video** (Only a video owner can edit his video and change the visibility or other things of videos)
9. **Generate Thumbnails For Your video Using FFmpeg** (After Uploading Video, The app automatically generated thumbnails for your video, and the thumbnails and videos are stored in your server like this: )

![1_mAshKIxdl_-_7xP0gS4BrA](https://user-images.githubusercontent.com/66161239/174224075-c80541cf-fb5c-47ac-829e-a1476253d69c.png)

9. **Strong and some advanced Firebases Rules** (I pretty much wasted a whole day on making good firebase rules but at last it was worthy)

![1_6duLaRXfiJKYljePdHOSEA](https://user-images.githubusercontent.com/66161239/174224122-22df9f79-0017-4701-8f3e-6d74a1b52c12.png)

