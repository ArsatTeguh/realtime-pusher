import Pusher from 'pusher'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://learn-management-system-one.vercel.app': 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());

const pusher = new Pusher({
  appId: "1787455",
  key: "3006004164fdcfb53231",
  secret: "259e10da4ea805ebe835",
  cluster: "ap1",
  // useTLS: true
});

app.post('/message', async (req, res) => {
  const data = req.body
  try {
    pusher.trigger(data.currentVideo, 'chat', data)
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
  }
});

// app.post('/action', async (req, res) => {
//   const data = req.body;

//   const isLike = data.actionSocket.like.includes(data.user);
//   const isDislike = data.actionSocket.dislike.includes(data.user);
//   const { like, dislike, id } = data.actionSocket;
//   const roomId = data.currentVideo
//   try {
//     if (isLike && data.like) {
//       const newdata = data.actionSocket.like.filter(likeValue => likeValue !== data.user);
//       console.log('1');
//       pusher.trigger(roomId, 'behavior', { id, like: newdata, dislike })
//       res.status(200).json({ message: "OK" });
//       return
//     } else if (isDislike && data.dislike) {
//       const newdata = data.actionSocket.dislike.filter(dislikeValue => dislikeValue !== data.user);
//       console.log('2');
//       pusher.trigger(roomId, 'behavior', { id, like, dislike: newdata })
//       res.status(200).json({ message: "OK" });
//       return
//     } else if (!isLike && data.like) {
//       const newdata = [...data.actionSocket.like, data.user];
//       console.log('3');
//       pusher.trigger(roomId, 'behavior', { id, like: newdata, dislike })
//       res.status(200).json({ message: "OK" });
//       return
//     } else if (!isDislike && data.dislike) {
//       const newdata = [...data.actionSocket.dislike, data.user];
//       console.log('4');
//       pusher.trigger(roomId, 'behavior', { id, like, dislike: newdata })
//       res.status(200).json({ message: "OK" });
//       return
//     }
//     console.log('5');
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//     }
// });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});