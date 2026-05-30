import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getListings, createListing, deleteListing,
  getSaved, unsaveListing,
  getInquiries, deleteInquiry
} from '../services/api';

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

const TAGS = ['WiFi', 'Parking', 'Furnished', 'Borehole', 'Generator', 'Security', 'Garden', 'Pool', 'CCTV', 'Balcony'];

const getRoomLabel = (bedrooms) => {
  if (bedrooms === 0) return 'Bedsitter';
  if (bedrooms === 1) return 'Single Room';
  if (bedrooms === 2) return '1 Bedroom';
  if (bedrooms === 3) return '2 Bedrooms';
  if (bedrooms === 4) return '3 Bedrooms';
  return `${bedrooms} Bedrooms`;
};

const Dashboard = () => {
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [saved, setSaved] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', price: '',
    bedrooms: '', neighborhood: '', address: '', tags: []
  });

  useEffect(() => {
    if (user?.role === 'landlord') {
      getListings().then((res) => {
        setListings(res.data.filter((l) => l.landlord === user.name));
      });
      getInquiries().then((res) => setInquiries(res.data));
    } else {
      getSaved().then((res) => setSaved(res.data));
      getInquiries().then((res) => setInquiries(res.data));
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createListing({
        ...form,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms)
      });
      setListings([...listings, res.data]);
      setShowForm(false);
      setForm({ title: '', description: '', price: '', bedrooms: '', neighborhood: '', address: '', tags: [] });
      setFeedback('✅ Listing created successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (e) {
      setFeedback('❌ Failed to create listing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter((l) => l.id !== id));
      setFeedback('Listing deleted');
      setTimeout(() => setFeedback(''), 3000);
    } catch (e) {
      setFeedback('Failed to delete listing');
    }
  };

  const handleUnsave = async (id) => {
    try {
      await unsaveListing(id);
      setSaved(saved.filter((l) => l.id !== id));
    } catch (e) {}
  };

  const handleDeleteInquiry = async (id) => {
    try {
      await deleteInquiry(id);
      setInquiries(inquiries.filter((i) => i.id !== id));
    } catch (e) {}
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <span className="role-badge">{user?.role}</span>
        </div>
      </div>

      {feedback && <div className="feedback">{feedback}</div>}

      {/* LANDLORD VIEW */}
      {user?.role === 'landlord' && (
        <>
          <section className="dashboard-section">
            <div className="section-header">
              <h2>My Listings ({listings.length})</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : '+ New Listing'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleCreate} className="listing-form">
                <h3>Post New Listing</h3>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Cozy Bedsitter in Kasarani"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe the property, what's included, nearby amenities..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (KSh/month)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 8000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type</label>
                    <select name="bedrooms" value={form.bedrooms} onChange={handleChange} required>
                      <option value="">Select room type...</option>
                      <option value="0">Bedsitter (room + small kitchen area)</option>
                      <option value="1">Single Room (room only, shared facilities)</option>
                      <option value="2">1 Bedroom (self contained - kitchen & bathroom inside)</option>
                      <option value="3">2 Bedrooms</option>
                      <option value="4">3 Bedrooms</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Neighborhood</label>
                    <select name="neighborhood" value={form.neighborhood} onChange={handleChange} required>
                      <option value="">Select neighborhood...</option>
                      {NEIGHBORHOODS.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Address / Directions</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="e.g. Near Shell Petrol Station, Kasarani"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Amenities (select all that apply)</label>
                  <div className="tag-selector">
                    {TAGS.map((tag) => (
                      <span
                        key={tag}
                        className={`tag-option ${form.tags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary">Post Listing</button>
              </form>
            )}

            {listings.length === 0 ? (
              <p className="empty">No listings yet. Click "+ New Listing" to post one.</p>
            ) : (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <div key={listing.id} className="listing-card">
                    <div className="listing-card-body">
                      <div className="listing-card-header">
                        <span className="neighborhood-badge">{listing.neighborhood}</span>
                        <span className="bedrooms">{getRoomLabel(listing.bedrooms)}</span>
                      </div>
                      <h3>{listing.title}</h3>
                      <p className="price">KSh {listing.price.toLocaleString()}/mo</p>
                      <div className="listing-tags">
                        {listing.tags.slice(0, 3).map((tag) => (
                          <span key={tag.id} className="tag">{tag.name}</span>
                        ))}
                      </div>
                      <div className="listing-card-actions">
                        <Link to={`/listings/${listing.id}`} className="btn-view">View</Link>
                        <button onClick={() => handleDelete(listing.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Inquiries Received ({inquiries.length})</h2>
            {inquiries.length === 0 ? (
              <p className="empty">No inquiries yet.</p>
            ) : (
              <div className="inquiries-list">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="inquiry-card">
                    <div className="inquiry-meta">
                      <strong>{inq.tenant}</strong> — <span>{inq.listing}</span>
                    </div>
                    <p>{inq.message}</p>
                    <small>{new Date(inq.created_at).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* TENANT VIEW */}
      {user?.role === 'tenant' && (
        <>
          <section className="dashboard-section">
            <h2>Saved Listings ({saved.length})</h2>
            {saved.length === 0 ? (
              <p className="empty">No saved listings yet. <Link to="/browse">Browse listings</Link></p>
            ) : (
              <div className="listings-grid">
                {saved.map((listing) => (
                  <div key={listing.id} className="listing-card">
                    <div className="listing-card-body">
                      <div className="listing-card-header">
                        <span className="neighborhood-badge">{listing.neighborhood}</span>
                        <span className="bedrooms">{getRoomLabel(listing.bedrooms)}</span>
                      </div>
                      <h3>{listing.title}</h3>
                      <p className="price">KSh {listing.price.toLocaleString()}/mo</p>
                      <div className="listing-card-actions">
                        <Link to={`/listings/${listing.id}`} className="btn-view">View</Link>
                        <button onClick={() => handleUnsave(listing.id)} className="btn-delete">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <h2>My Inquiries ({inquiries.length})</h2>
            {inquiries.length === 0 ? (
              <p className="empty">No inquiries sent yet.</p>
            ) : (
              <div className="inquiries-list">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="inquiry-card">
                    <div className="inquiry-meta">
                      <strong>{inq.listing}</strong>
                    </div>
                    <p>{inq.message}</p>
                    <div className="inquiry-footer">
                      <small>{new Date(inq.created_at).toLocaleDateString()}</small>
                      <button onClick={() => handleDeleteInquiry(inq.id)} className="btn-delete-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;