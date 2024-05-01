# How to run the different versions of CondoVision

## Mobile version (React Native)
1. Clone the repository:  
``` git clone https://github.com/XavierGuertin/CondoVision.git ```
2. Install dependencies:
``` npm install ```

3. Go to the mobile version folder :  
``` cd CondoVision/apps/native ```

4. Run the app:  
``` npm run dev ```

5. Open the Expo app on your phone and scan the QR code OR go to http://localhost:19006/ on your browser.

## Web Version (NextJS) [condo-vision.vercel.app](https://condo-vision.vercel.app)
1. Clone the repository:  
``` git clone https://github.com/XavierGuertin/CondoVision.git ```

2. Install dependencies:
``` npm install ```
3. Go to the web version folder :  
``` cd CondoVision/apps/web ```
4. Run the app:  
``` npm run dev ```
5. Open http://localhost:3000/ on your browser.

Note that both apps share the same Firebase database, so you can easily switch between them. Just make sure to be in the right directory (`CondoVision/apps/native` or `CondoVision/apps/web`) before running the app.