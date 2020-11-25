import express from "express";
const router = express.Router();

import axios from "axios";

import { v4 as uuidv4 } from "uuid";

// Url de notre API
const url = "http://www.omdbapi.com/?t=inception&apikey=c4c44ced";

// On instancie une variable movies qui est un tableau vide
let movies = [];

// On destructe data pour que ça reste propre
const {
  data: { Title, Year, Released, Runtime, Actors, Poster, BoxOffice, Ratings },
} = await axios.get(url); // On fetch nos data avec axios.get

// On créer une constante pour destructurer nos données
const filmsData = {
  title: Title,
  year: Year,
  yearOfRelease: Released,
  duration: Runtime,
  actors: [Actors],
  posters: Poster,
  boxOffice: BoxOffice,
  rottenTomatoesScore: [Ratings],
};
// On push l'id et nos données dans movies
movies.push({ id: uuidv4(), ...filmsData });

/* Tout les films */
router.get("/", (req, res, next) => {
  res.send(movies);
});

// Ajoute nos fims dans notre DB
router.post("/", function (req, res) {
  const movie = req.body;

  movies.push({ ...movie, id: uuidv4() });

  res.send(`Le film ${movie.title} a bien été ajouté à la base de donnée`);
});

// Trouver les details d'un film avec son ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const foundFilms = movies.find((movie) => movie.id === id);

  res.send(foundFilms);
});

// Supprime tout les films
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  movies = movies.filter((user) => user.id != id); // si le return est un true ça garde le movie dans movies sinon si il est egal a false ça le retire

  res.send(`Film avec l'id ${id} supprimé de la base de donnée`);
});

export default router;

// Patch est utilisé quand on veut partiellement modifer quelque chose != PUT qui sert à TOUT modifier
router.patch("/:id", (req, res) => {
  // id de l'url qu'on utilise pour match avec l'id de req.body
  const { id } = req.params;
  const {
    author,
    title,
    yearOfRelease,
    duration,
    actors,
    posters,
    boxOffice,
    rottenTomatoesScore,
  } = req.body;

  const movie = movies.find((movie) => movie.id === id); // retourne le movie qui va etre modifié

  // si author existe alors la valeur author de l'id du movie qu'on a find va être égale à la movie.author de la requete qu'on envoi avec patch
  if (author) movie.author = author;
  if (title) movie.title = title;
  if (yearOfRelease) movie.yearOfRelease = yearOfRelease;
  if (duration) movie.duration = duration;
  if (actors) movie.actors = actors;
  if (posters) movie.posters = posters;
  if (boxOffice) movie.boxOffice = boxOffice;
  if (rottenTomatoesScore) movie.rottenTomatoesScore = rottenTomatoesScore;

  res.send(`${title} a bien été mis à jours`);
});
