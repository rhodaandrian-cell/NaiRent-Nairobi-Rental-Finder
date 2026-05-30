import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/api';

const NEIGHBORHOODS = [
  'All', 'Westlands', 'Kilimani', 'Karen', 'Thika Road', 'Roysambu',
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

const PER_PAGE = 50;

const Browse = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const neighborhood = searchParams.get('neighborhood') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const maxPrice = searchParams.get('max_price') || '';

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    const params = {};
    if (neighborhood) params.neighborhood = neighborhood;
    if (bedrooms) params.bedrooms = bedrooms;
    if (maxPrice) params.max_price = maxPrice;

    getListings(params)
      .then((res) => setListings(res.data))
      .finally(() => setLoading(false));
  }, [neighborhood, bedrooms, maxPrice]);

  const updateFilter = (key, value) => {
    setCurrentPage(1);
    const params = Object.fromEntries(searchParams);
    if (value && value !== 'All') {
      params[key] = value;
    } else {
      delete params[key];
    }
    setSearchParams(params);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim()) {
      const filtered = NEIGHBORHOODS.filter(
        (n) => n !== 'All' && n.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const match = NEIGHBORHOODS.find(
      (n) => n.toLowerCase() === searchInput.toLowerCase()
    );
    if (match) {
      updateFilter('neighborhood', match);
    } else if (searchInput.trim()) {
      updateFilter('neighborhood', searchInput.trim());
    }
    setSearchInput('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (area) => {
    updateFilter('neighborhood', area);
    setSearchInput('');
    setSuggestions([]);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
    setSuggestions([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(listings.length / PER_PAGE);
  const paginated = listings.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="browse">
      <h1>Browse Listings</h1>

      {/* Search Bar */}
      <div className="search-area-wrapper">
        <form onSubmit={handleSearchSubmit} className="search-area-form">
          <div className="search-area-input-wrapper">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInput}
              placeholder="🔍 Search any area e.g. Mwihoko, Githurai, Rongai..."
              className="search-area-input"
            />
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((area) => (
                  <div
                    key={area}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(area)}
                  >
                    📍 {area}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Filters */}
      <div className="filters">
        <select
          value={neighborhood}
          onChange={(e) => updateFilter('neighborhood', e.target.value)}
        >
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n === 'All' ? '' : n}>{n}</option>
          ))}
        </select>

        <select value={bedrooms} onChange={(e) => updateFilter('bedrooms', e.target.value)}>
          <option value="">Any Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
        </select>

        <select value={maxPrice} onChange={(e) => updateFilter('max_price', e.target.value)}>
          <option value="">Any Price</option>
          <option value="10000">Up to KSh 10,000</option>
          <option value="20000">Up to KSh 20,000</option>
          <option value="35000">Up to KSh 35,000</option>
          <option value="50000">Up to KSh 50,000</option>
          <option value="100000">Up to KSh 100,000</option>
          <option value="200000">Up to KSh 200,000</option>
        </select>

        {(neighborhood || bedrooms || maxPrice) && (
          <button onClick={clearFilters} className="btn-clear">✕ Clear Filters</button>
        )}
      </div>

      {/* Active filter indicator */}
      {neighborhood && (
        <div className="active-filter">
          Showing listings in <strong>{neighborhood}</strong>
          <span onClick={clearFilters} className="remove-filter"> ✕</span>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="loading">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="empty">No listings found. Try different filters.</div>
      ) : (
        <>
          <p className="results-count">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} found
            {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
          </p>

          <div className="listings-grid">
            {paginated.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce((acc, page, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== page - 1) {
                    acc.push(<span key={`dots-${page}`} className="page-dots">...</span>);
                  }
                  acc.push(
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`btn-page ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  );
                  return acc;
                }, [])}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;