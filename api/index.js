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
  useTLS: true
});

app.post('/joinRoom', (req, res) => {
  const data = req.body;
  console.info('User joined room', data.currentVideo);
  res.sendStatus(200);
});

app.post('/message', async (req, res) => {
  const data = req.body
  try {
    pusher.trigger(data.currentVideo, 'chat', data)
    res.json({ message: "OK" });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

app.post('/action', (req, res) => {
  const data = req.body;
  try {
    const isLike = data.actionSocket.like.includes(data.user);
    const isDislike = data.actionSocket.dislike.includes(data.user);
    const { like, dislike, id } = data.actionSocket;
    res.json({ message: "OK" });
    if (isLike && data.like) {
      const newdata = data.actionSocket.like.filter(likeValue => likeValue !== data.user);
      return pusher.trigger(data.currentVideo, 'behavior', { id, like: newdata, dislike });
    } else if (isDislike && data.dislike) {
      const newdata = data.actionSocket.dislike.filter(dislikeValue => dislikeValue !== data.user);
      return pusher.trigger(data.currentVideo, 'behavior', { id, like, dislike: newdata });
    } else if (!isLike && data.like) {
      const newdata = [...data.actionSocket.like, data.user];
      return pusher.trigger(data.currentVideo, 'behavior', { id, like: newdata, dislike });
    } else if (!isDislike && data.dislike) {
      const newdata = [...data.actionSocket.dislike, data.user];
      return pusher.trigger(data.currentVideo, 'behavior', { id, like, dislike: newdata });
    }
  } catch (error) {
    console.log(error);
    // Kirim status error jika terjadi kesalahan
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});