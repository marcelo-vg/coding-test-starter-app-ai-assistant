import type { Gig } from '../types';

const postedFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <li className="gig-card">
      <div className="gig-card__head">
        <h3 className="gig-card__title">{gig.title}</h3>
        <span className="gig-card__pay">${gig.payRate}/hr</span>
      </div>

      <p className="gig-card__description">{gig.description}</p>

      <div className="gig-card__meta">
        <span className="tag">{gig.category}</span>
        <span className={`tag ${gig.remote ? 'tag--remote' : 'tag--onsite'}`}>
          {gig.remote ? 'Remote' : 'On-site'}
        </span>
        <span className="gig-card__location">{gig.location}</span>
        <span className="gig-card__posted">
          Posted {postedFormatter.format(new Date(gig.postedAt))}
        </span>
      </div>
    </li>
  );
}
