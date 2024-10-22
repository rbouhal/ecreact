import React, { useRef, useEffect } from 'react';
import './InfoSection.css';

function InfoSection({ title, description, imageSrc, isImageLeft }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSectionRef = sectionRef.current; 

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          } else {
            entry.target.classList.remove('fade-in'); 
          }
        });
      },
      { threshold: 0.2 } 
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []); 

  return (
    <div className={`info-section ${isImageLeft ? 'image-left' : 'image-right'}`} ref={sectionRef}>
      <div className="text-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="image-content">
        <img src={imageSrc} alt={title} />
      </div>
    </div>
  );
}

export default InfoSection;
