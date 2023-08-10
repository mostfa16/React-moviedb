import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TVShow from '../interface/TVShow';


interface TVSeriesProps {
  apiKey: string;
}

const TVSeries: React.FC<TVSeriesProps> = ({ apiKey }) => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [columns, setColumns] = useState<number>(import.meta.env.VITE_REACT_APP_COLUMN); // Default number of columns
  
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  useEffect(() => {
    console.log('useEffect3');
    axios.get(`${API_URL}/tv/popular?api_key=${apiKey}`)
      .then(response => {
        setTVShows(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filteredTVShows = tvShows.filter(tvShow =>
    tvShow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Popular TV Series</h1>

      <div className="row">
                <div className={`col-md-6`}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for TV Serie"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className={`col-md-6`}>
                    <div className="mb-3">
                        <select
                            className="form-control"
                            value={columns}
                            onChange={(e) => setColumns(Number(e.target.value))}
                        >
                            <option value={1}>1 Columns</option>
                            <option value={2}>2 Columns</option>
                            <option value={3}>3 Columns</option>
                            <option value={4}>4 Columns</option>
                            <option value={6}>6 Columns</option>
                        </select>
                    </div>
                </div>
            </div>
      <div className="row">
        {filteredTVShows.map(serie => (
           <div className={`col-md-${12 / columns}`} key={serie.id}>
            <div className="card mb-4">
              {/* <img src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} className="card-img-top" alt={serie.name} /> */}
              <img src={`https://image.tmdb.org/t/p/w500${serie.backdrop_path}`} className="card-img-top" alt={serie.name} />
              <div className="card-body">
                <h5 className="card-title">{serie.name}</h5>
                <p className="card-text">Vote Average: {serie.vote_average}</p>
                <p className="card-text">{serie.overview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TVSeries;
