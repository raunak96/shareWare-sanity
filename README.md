# SHAREWARE SOCIAL MEDIA APPLICATION
- Tech Stack
  - Front-End: `React`, `TailwindCSS`
  - Back-End : `Sanity CMS`

## BackEnd
- Setting Up Schemas. ([Refer](https://www.sanity.io/docs/create-a-schema-and-configure-sanity-studio)).
- We have 5 Schema :
  1. [User]("./../backend/schemas/user.js)
  2. [Pin](./backend/schemas/pin.js) -> This is the main resource in our app i.e the image which is posted.
  3. [Comment](./backend/schemas/comment.js)
  4. [Save](./backend/schemas/save.js) -> This contains data of user who saves a particular Pin. A pin will have an array of Comments and Saves.
  5. [PostedBy](./backend/schemas/postedBy.js) -> A reference to User who posted the image.


## FrontEnd
- For **Google Login**, we used `react-google-login`(it is deprecated, will find substitute soon). With it, Google Login is setup pretty easily. All we need is to get our `OAuth 2.0 Client ID` from `google cloud console` and put it in Component of react-google-login. [Refer](frontend/src/pages/login.jsx#L43).
- If Login successful, we also need to add this user to Sanity `user` Schema if it was not already added. We do this with Sanity Client method `createIfNotExists` [Refer](frontend/src/pages/login.jsx#L20). But we run into some **permission & Cors** issue if we try to add anything to Sanity for the 1st time. We need to do the following before interacting with Sanity Client from our App:
    1.  To Setup Sanity Client, we need `projectId` and `token`. For that we type `sanity manage` in terminal from backend which opens SanityIO Project settings. Here we can find **projectId**.
        1.  For Token, we need to goto `API-->Tokens` and then Add new Token. If we want write permissions as well, we need to give it `Editor` permission. This will generate the token.
    2.  Now if we try to add user(or any other request) to Sanity backend, we will get `CORS` error. To fix this, again in `API` tab in Sanity Manage, we will see `CORS origins` tab. Here we simply add our frontend baseURL and we are good to go.

### QUERYING IN SANITY 
- Querying Data from Sanity uses  GROQ (Graph-Relational Object Queries) language (somewhat like GQL queries). It has a particular syntax for queries. [Refer](./frontend/src/queries/userQueries.js). [Docs](https://www.sanity.io/docs/js-client).
- We query sanity for getting pins based on certain categories or searchTerm which we used data filtering, projection, dereferencing and text matching. [Refer](./frontend/src/queries/pinQueries.js). [Docs for Query](https://www.sanity.io/docs/how-queries-work). [Docs for Text-matching](https://www.sanity.io/docs/query-cheat-sheet#170b92d4caa2).

### UPDATING DOCS IN SANITY 
- Updating Document in Sanity called Patching (in our case we did it for adding data to save array inside Pin document)
  - `Patch` method is used to update document in Sanity. [Refer Code](/frontend/src/components/Pin.jsx#L24), [Docs](https://www.sanity.io/docs/js-client#patch-update-a-document).
  
### MASONRY LAYOUT
- For displaying all Pins in Page we used `MasonryLayout` instead of simple Grid or Flex-box.We used [react-masonry-css](https://github.com/paulcollett/react-masonry-css) package for it which arranges which places items in fixed no of rows(or columns) which are responsive according to breakpoints but heights(or widths) of items are unequal.

  
### UPLOADING IMAGE TO SANITY (FILES ARE CALLED ASSETS)
- We use Sanity Client function called assets.upload() to upload file/image to sanity which then returns the file document if successful.[Refer](frontend/src/pages/createPin.jsx#L29).