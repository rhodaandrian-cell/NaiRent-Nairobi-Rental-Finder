import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/api';

const NEIGHBORHOODS = [
  'Westlands', 'Kilimani', 'Karen', 'Thika Road', 'Roysambu',
  'Kahawa', 'Githurai', 'Ruiru', 'Kasarani', 'Ruaka',
  'Eastleigh', 'Mwihoko', 'Lavington', 'Parklands', 'Kileleshwa',
  'South B', 'South C', 'Langata', 'Embakasi', 'Utawala',
  'Donholm', 'Umoja', 'Buruburu', 'Kayole', 'Komarock',
  'Dagoretti', 'Riruta', 'Kabete', 'Kikuyu', 'Rongai',
  'Ngong', 'Kitengela', 'Syokimau', 'Mlolongo', 'Imara Daima',
  'Fedha', 'Pipeline', 'Soweto', 'Mathare', 'Huruma',
  'Zimmerman', 'Muthaiga', 'Ridgeways', 'Gigiri', 'Runda',
  'Spring Valley', 'Loresho', 'Nairobi West', 'Nairobi South', 'CBD'
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getListings().then((res) => setListings(res.data.slice(0, 6)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?neighborhood=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <h1>Find Your Perfect Home in <span>Nairobi</span></h1>
        <p>Browse verified rental listings across Nairobi's best neighborhoods</p>
        <form onSubmit={handleSearch} className="search-bar">
          <select value={search} onChange={(e) => setSearch(e.target.value)}>
            <option value="">All Neighborhoods</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Neighborhoods */}
      <section className="neighborhoods">
        <h2>Browse by Neighborhood</h2>
        <div className="neighborhood-grid">
          {NEIGHBORHOODS.slice(0, 8).map((n) => (
            <Link key={n} to={`/browse?neighborhood=${n}`} className="neighborhood-chip">
              {n}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="featured">
        <h2>Featured Listings</h2>
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="view-all">
          <Link to="/browse" className="btn-primary">View All Listings →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;