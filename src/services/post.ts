import { ref, child, get, push, update } from 'firebase/database';

export const getPosts = () => {
  // get(child(ref(db), `posts`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
};

export const setPost = (uid: string, username: string, picture: any, title: string, body: string) => {
  // A post entry.
  const postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  // const newPostKey = push(child(ref(db), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};

  // updates[`/posts/${newPostKey}`] = postData;
  // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  // return update(ref(db), updates);
}