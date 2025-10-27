import { tours } from "../data";
import Title from "./Title";
import Tour from "./Tour";

import { useState } from 'react'


const Tours = () => {
  const [toursData, setToursData] = useState(tours)

  const handleDeleteTour = (tourId) => {
    const updatedTours = toursData.filter((tour) => tour.id !== tourId);
    setToursData(updatedTours);
  };

  return (
    <section className="section" id="tours">
      <Title title="featured" subTitle="tours" />

      <div className="section-center featured-center">
        {toursData.map((tour) => {
          return <Tour key={tour.id} {...tour} onDelete={handleDeleteTour} />;
        })}
      </div>
    </section>
  );
};
export default Tours;
