import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Movie from '../interface/Movie';
import SearchBar from '../components/SearchBar';
import ColumnsSelect from '../components/ColumnsSelect';
import { Link } from 'react-router-dom';
import { HeaderTitle } from '../components/HeaderTitle';
import loadingGif from '../assets/loading.gif';
import StarRating from '../components/StarRating';

interface PopularMoviesProps {
    apiKey: string;
}

const PopularMovies: React.FC<PopularMoviesProps> = ({ apiKey }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState<number>(
        import.meta.env.VITE_REACT_APP_COLUMN
    );
    const [isBackdrop, setIsBackdrop] = useState(true);

    const toggleImage = () => {
        setIsBackdrop(!isBackdrop);
    };

    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        if (movies.length > 0) {
            setLoading(false);
            return;
        }

        console.log('useEffect2');
        axios
            .get(`${API_URL}/movie/popular?api_key=${apiKey}`)
            .then((response) => {
                setMovies(response.data.results);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [API_URL, apiKey, movies]);

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container my-2">
            <HeaderTitle value="Popular Movies" />
            <div className="row">
                <SearchBar
                    value={searchQuery}
                    placeholderValue="Search for a Movie"
                    onChange={setSearchQuery}
                />
                <ColumnsSelect value={columns} onChange={setColumns} />
            </div>
            {loading ? (
                <div className="row">
                    <div className="col-md-12 text-center">
                        <img width="400px" src={loadingGif} alt="Loading..." />
                    </div>
                </div>
            ) : (
                <div className="row">
                    {filteredMovies.map((movie) => (
                        <div
                            className={`col-md-${12 / columns}`}
                            key={movie.id}
                        >
                            <div className="card mb-4">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${
                                        isBackdrop
                                            ? movie.backdrop_path
                                            : movie.poster_path
                                    }`}
                                    className={`card-img-top ${
                                        isBackdrop ? 'backdrop' : 'poster'
                                    }`}
                                    alt={movie.title}
                                    onClick={toggleImage}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {movie.title}{' '}
                                        ({new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                        }).format(new Date(movie.release_date))})
                                    </h5>

                                    {/* <p className="card-text">
                                        Vote Average: {movie.vote_average}
                                    </p> */}
                                    <StarRating value={movie.vote_average} />
                                    <p className="card-text">
                                        {movie.overview.substring(0, 50)}...
                                    </p>

                                    <button className="btn btn-primary">
                                        {' '}
                                        <Link
                                            to={`/popular-movies/${movie.id}`}
                                            className="text-decoration-none text-light"
                                        >
                                            Read More
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopularMovies;
