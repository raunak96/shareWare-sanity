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