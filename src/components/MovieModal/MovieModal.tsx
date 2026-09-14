import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movies';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
            className={styles.backdrop_image}
          />
        )}

        <div className={styles.content}>
          <h2 className={styles.title}>{movie.title}</h2>

          {movie.release_date && (
            <p className={styles.release_date}>
              Release: {new Date(movie.release_date).getFullYear()}
            </p>
          )}

          {movie.vote_average && (
            <p className={styles.rating}>
              ⭐ {movie.vote_average.toFixed(1)}/10
            </p>
          )}

          {movie.overview && (
            <p className={styles.overview}>{movie.overview}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
