Thank You for Trusting Hybapps .

please follow this steps to use any Ionic3 theme.


* unzip the theme package
* create a new Ionic3 app
* Replace the src,www and package.json for the new app  with those for the theme(from the unzipped folder) 
* open app in cmd then Run these lines:

1- npm install 
2- ionic serve
3- ionic platform add android/ios
4- ionic build android/ios --prod

note:To control the animation in the app(if there's) their will be one of this two ways:
1)There's a checkbox in the setting to on/off the animations in the app.

 -----------------------------OR-------------

2)There is a file named "app-config.ts" in the app folder
that helps you control the animation by changing  from true to false and vice versa

export const APP_CONFIG = {
   ALLOW_ANIMATION:true
};