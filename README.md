# Cipher-Connect

> App is **Work In Progress**

A **multimedia messaging app** built with sockets, react, node and mySQL.

[![design source](./assets/design_source.jpg)](https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media)


## Demo

Deplyed on [render](https://dashboard.render.com/)

https://cipher-connect.onrender.com/



## Features

- User managment
- User authentication
- Light/dark mode toggle
- Thorough form validation


## Built With

- Database: mySQL. Hosted on [aiven.io](https://aiven.io/)
- Client hosted on [netlify](https://www.netlify.com/)
- Server hosted on [render](https://render.com/)
- [tsc-watch](https://www.npmjs.com/package/tsc-watch)
- Typescript-React for the frontend
- Nodejs for backend
- Socket.io for fullduplix communication
- Material ui for design
- Express for handling routes
- mySQL for database
- Prisma as an ORM
- [React-Hook-Form](https://react-hook-form.com/) for handling forms
- Vite for managing development and production ecosystem


## 🚀 What I learned

- Error handling
- Routing
- User authentication
- Building forms with react-hook-form
- Error boundries
- Custom Hooks
- React-query
- `crypto.randomUUID()` only runs when the URL scheme is https or client is running on localhost
- Don't use ORMs, or at the very least avoid prisma. The overhead and absolute unnecessary computation outweighs the any benefits whatsoever. 


## Installation

Install my-project with yarn

```bash
  yarn # Install dependencies
  yarn build # Run build script (optional)

  # One of the following commands
  yarn preview # For production preview
  yarn dev # For development preview
```


## Design

[Mohammad Hashemi](https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media) from [dribble](https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media)

## Acknowledgements
 - [Blog Explaining DBML Generator](https://notiz.dev/blog/prisma-dbml-generator)
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
 - [Design inspiration](https://dribbble.com/shots/18945888-Messenger-Mobile-Web-Application-Light-Mode/attachments/14116324?mode=media)
 - [prisma-erd-generator](npmjs.com/package/prisma-erd-generator)
 - [prisma-dbml-generator](https://notiz.dev/blog/prisma-dbml-generator#dbml-generator)
 - [Wrap Balancer for balancing paragraphs](https://react-wrap-balancer.vercel.app/)
 - [Glassmorph/ frosted glass effect](https://css.glass/)
 - [MDN's radius generator](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_backgrounds_and_borders/Border-radius_generator)
 - [Reddit: Why doesn't res.redirect() redirects SPAs like react](https://www.reddit.com/r/learnjavascript/comments/bs9gq0/comment/eonklyl/?utm_source=share&utm_medium=web2x&context=3)
 - [TS declaration merging](https://dev.to/chris927/extending-express-types-with-typescript-declaration-merging-typescript-4-3jh)
 - [Mai Vang's article on how to deploy a full-stack app on render](https://medium.com/@vmaineng/how-to-deploy-mern-full-stack-to-render-f7ab380660b6)
 - [Walrus operator equivalent in for-loops](https://stackoverflow.com/a/70414127)
 - [Axios interceptors to retry failed requests](https://javascript.plainenglish.io/how-to-retry-requests-using-axios-64c2da8340a7)

## ToDo

- [ ] Show ghost text when user types (not good for performance but it would look really nice).
- [ ] Send a private message to yourself.
- [x] Extract list function from TemproratyDrawer into a separate component.
- [ ] A loader/ spinner for each element that depends on fetching data from server.
- [x] Remove abstraction from TemporaryDrawer, It is causing unnecessary confusion. 
- [x] DO NOT SEND OTHER PEOPLE'S PASSWORD HASHS TO OTHER USERS!!! (How did this even happen??)
- [ ] userRooms in backend should be stored in a set (or something similar) not an array.
- [x] Ensure a room without participants can not exist OR run a scheduled job in DB to delete all rooms without participants.
- [x] Might wanna use a library like [promise-retry](https://www.npmjs.com/package/promise-retry) to re-run failed queries to DB.
- [x] Add support for group chat.
- [ ] Break text into multiple lines when a single word has too many characters and overflows.
- [ ] Host your own fonts.
- [x] Fix .env variables to be platform agnostic.
- [ ] Setup protected API routes.
- [ ] Make website responsive by setting position "abolute" to room info and room list sidebar.
- [ ] Notify user if no internet connection is availabe. 
- [ ] Throw error if logging in while the server is unreachable. (check if server is unreachable first)
- [ ] Provide option to hide password while typing.
- [ ] Redirect client to login page on logout using res.redirect('logout')
- [ ] Warn before running `crypto.randomUUID()` in an unsecure context (http scheme) and alert user or throw error.
- [ ] Use useInfiniteQuery for fetching messages.
- [ ] Have a default room that every new user has. Make it a room with the developer and a greeting message.
- [ ] Add option for ephemeral login which is deleted after some time. Or an option for tyring the app.
- [ ] Microphone icon in fevicon should only appear while recording.

## License

[GPL 3](./LICENSE)

