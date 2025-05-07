import express from "express";
import '../db/mongoose.js';
import { Song } from "./song.js";

const app = express();

app.use(express.json());

app.post('/songs', async (req, res) => {
    const song = new Song(req.body);

    try {
        await song.save();
        res.send(song);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/songs', async (req, res) => {
    if (req.query.length || req.query.genre) {
        res.status(400).send({ error: 'No puede buscarse una canción por la duración o género de la misma.' });
    } else {
        const { title, author } = req.query;

        const filter: any = {};
        if (title) filter.title = title;
        if (author) filter.author = author;

        try {
            const songs = await Song.find(filter);

            if (songs.length === 0) {
                res.status(404).send();
            } else {
                res.send(songs);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

app.patch('/songs/:id', async (req, res) => {
    const allowedUpdates = ['title', 'author', 'genre', 'length'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        res.status(400).send({ error: 'Alguno de los parámetros a actualizar no está permitido.' });
    } else {
        try {
            const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if (!song) {
                res.status(404).send();
            } else {
                res.send(song);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

app.delete('/songs/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);

        if (!song) {
            res.status(404).send();
        } else {
            res.send(song);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

const port = process.env.PORT || 3000;

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});