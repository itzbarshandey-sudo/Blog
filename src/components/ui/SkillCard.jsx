import { useRef } from 'react';
import usePointerTilt from '../../hooks/usePointerTilt.js';
import PillTag from './PillTag.jsx';

export default function SkillCard({ title, description, icon, color, tags }) {
  const tiltRef = useRef(null);
  usePointerTilt(tiltRef, { max: 12 });

  return (
    <div className="t-tilt" ref={tiltRef}>
      <div className="skill-card t-tilt-card" style={{ '--skill-color': color }}>
        <div className="t-tilt-glare"></div>
        <div className="skill-icon" style={{ '--skill-color': color }} dangerouslySetInnerHTML={{ __html: icon }} />
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="skill-tags">
          {tags.map((tag, i) => (
            <PillTag key={i} category={tag.category}>{tag.label}</PillTag>
          ))}
        </div>
      </div>
    </div>
  );
}
