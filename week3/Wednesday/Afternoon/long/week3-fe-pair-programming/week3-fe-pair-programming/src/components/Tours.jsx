import Tour from './Tour';
import { tours } from '../data'
import Title from './Title'

const Tours=() => {
  return (
    <section className="section" id="tours">
  <Title title='Featured' subTitle='Tours' />
  <div className="section-center featured-center">
    {tours.map((tour) => {
      return <Tour {...tour} key={tour.id} />
    })}
  </div>
</section>

  );
}

export default Tours;
