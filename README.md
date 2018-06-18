#  chrome-extension-youtube-controller

This project contains 3 parts:

+ Convinient global Keyboard control of youtube (previous/next/like/stop)
+ Hourly video recommendation based on user's behavior (show interest to a video by watching 90%, or hit like button, or hit subscribe button, more behavior will be count in the future)
+ Ad filter (in progress)



#### Problems met in developing this project:

+ Notifications
  + If id is static, new notification will not shown but is updated.
+ Async
  + All chrome api are async which mean you can not call sync function.







2018 0616 0270 623 