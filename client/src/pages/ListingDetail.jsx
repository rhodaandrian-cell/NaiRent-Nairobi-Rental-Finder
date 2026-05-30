import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, saveListing, unsaveListing, getSaved, createInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getImage = (id, bedrooms) => {
  const imageSets = {
    small: [
      'photo-1522708323590-d24dbb6b0267',
      'photo-1560448204-e02f11c3d0e2',
      'photo-1493809842364-78817add7ffb',
      'photo-1536376072261-38c75010e6c9',
      'photo-1554995207-c18c203602cb',
    ],
    mid: [
      'photo-1502672260266-1c1ef2d93688',
      'photo-1484154218962-a197022b5858',
      'photo-1512917774080-9991f1c4c750',
      'photo-1545324418-cc1a3fa10c00',
      'photo-1567767292278-a4f21aa2d36e',
      'photo-1556909114-f6e7ad7d3136',
      'photo-1600596542815-ffad4c1539a9',
      'photo-1600585154340-be6161a56a0c',
    ],
    luxury: [
      'photo-1613490493576-7fde63acd811',
      'photo-1600607687939-ce8a6c25118c',
      'photo-1605276374104-dee2a0ed3cd6',
      'photo-1600047509807-ba8f99d2cdde',
      'photo-1618221195710-dd6b41faaea6',
    ]
  };

  let set;
  if (bedrooms >= 3) set = imageSets.luxury;
  else if (bedrooms <= 1) set = imageSets.small;
  else set = imageSets.mid;

  const photo = set[id % set.length];
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=80`;
};

const getRoomLabel = (bedrooms) => {
  if (bedrooms === 0) return 'Bedsitter';
  if (bedrooms === 1) return 'Single Room';
  if (bedrooms === 2) return '1 Bedroom (Self Contained)';
  if (bedrooms === 3) return '2 Bedrooms';
  if (bedrooms === 4) return '3 Bedrooms';
  return `${bedrooms} Bedrooms`;
};

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    getListing(id).then((res) => setListing(res.data));
    if (user?.role === 'tenant') {
      getSaved().then((res) => {
        setIsSaved(res.data.some((l) => l.id === parseInt(id)));
      });
    }
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      if (isSaved) {
        await unsaveListing(id);
        setIsSaved(false);
        setFeedback('Removed from saved');
      } else {
        await saveListing(id);
        setIsSaved(true);
        setFeedback('Saved!');
      }
    } catch (e) {
      setFeedback('Something went wrong');
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await createInquiry({ message, listing_id: parseInt(id) });
      setMessage('');
      setFeedback('Inquiry sent successfully!');
    } catch (e) {
      setFeedback('Failed to send inquiry');
    }
  };

  if (!listing) return <div className="loading">Loading...</div>;

  return (
    <div className="listing-detail">

      {/* Hero Image */}
      <div className="listing-hero-image">
        <img
          src={getImage(listing.id, listing.bedrooms)}
          alt={listing.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
          }}
        />
      </div>

      <div className="listing-detail-header">
        <div>
          <span className="neighborhood-badge">{listing.neighborhood}</span>
          <h1>{listing.title}</h1>
          <p className="listing-address">📍 {listing.address}</p>
        </div>
        <div className="listing-detail-price">
          <span>KSh {listing.price.toLocaleString()}</span>
          <small>/month</small>
        </div>
      </div>

      <div className="listing-detail-body">
        <div className="listing-detail-main">
          <div className="listing-meta">
            <span>🛏 {getRoomLabel(listing.bedrooms)}</span>
            <span>👤 {listing.landlord}</span>
            <span className={listing.available ? 'available' : 'unavailable'}>
              {listing.available ? '✅ Available' : '❌ Not Available'}
            </span>
          </div>

          <h3>Description</h3>
          <p>{listing.description}</p>

          <h3>Amenities</h3>
          <div className="listing-tags">
            {listing.tags.map((tag) => (
              <span key={tag.id} className="tag">{tag.name}</span>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="listing-detail-actions">
          {user?.role === 'tenant' && (
            <>
              <button onClick={handleSave} className={`btn-save ${isSaved ? 'saved' : ''}`}>
                {isSaved ? '❤️ Saved' : '🤍 Save Listing'}
              </button>

              <div className="inquiry-form">
                <h3>Contact Landlord</h3>
                <form onSubmit={handleInquiry}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, I'm interested in this property..."
                    rows={4}
                    required
                  />
                  <button type="submit" className="btn-primary">Send Inquiry</button>
                </form>
              </div>
            </>
          )}

          {!user && (
            <div className="login-prompt">
              <p>Login to save or inquire about this listing</p>
              <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
            </div>
          )}

          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;