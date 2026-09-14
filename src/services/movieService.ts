import axios from "axios";
import { type Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

const movieClient = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<MoviesResponse> => {
  const response = await movieClient.get<MoviesResponse>("search/movie", {
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
  });
  return response.data;
};