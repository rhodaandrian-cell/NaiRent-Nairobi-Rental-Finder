import { Link } from 'react-router-dom';

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
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=80`;
};

const getRoomLabel = (bedrooms) => {
  if (bedrooms === 0) return 'Bedsitter';
  if (bedrooms === 1) return 'Single Room';
  if (bedrooms === 2) return '1 Bedroom';
  if (bedrooms === 3) return '2 Bedrooms';
  if (bedrooms === 4) return '3 Bedrooms';
  return `${bedrooms} Bedrooms`;
};

const ListingCard = ({ listing }) => {
  return (
    <div className="listing-card">
      <div className="listing-image-wrapper">
        <img
          src={getImage(listing.id, listing.bedrooms)}
          alt={listing.title}
          className="listing-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="price-badge">KSh {listing.price.toLocaleString()}/mo</span>
      </div>

      <div className="listing-card-body">
        <div className="listing-card-header">
          <span className="neighborhood-badge">{listing.neighborhood}</span>
          <span className="bedrooms">{getRoomLabel(listing.bedrooms)}</span>
        </div>
        <h3>{listing.title}</h3>
        <p className="listing-description">{listing.description}</p>
        <div className="listing-tags">
          {listing.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
          {listing.tags.length > 3 && (
            <span className="tag tag-more">+{listing.tags.length - 3}</span>
          )}
        </div>
        <div className="listing-footer">
          <span className="landlord-name">👤 {listing.landlord}</span>
          <Link to={`/listings/${listing.id}`} className="btn-view">View →</Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;