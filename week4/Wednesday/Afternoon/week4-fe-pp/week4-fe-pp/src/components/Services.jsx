import { services } from '../data'
import Title from './Title'
import Service from './Service'


import { useState } from 'react';


const Services = () => {

  const [servicesData, setServicesData] = useState(services);

  const handleDeleteService = (serviceId) => {
    const updatedServices = servicesData.filter((service) => service.id !== serviceId);
    setServicesData(updatedServices);
  };

  return (
    <section className='section services' id='services'>
      <Title title='our' subTitle='services' />



      <div className='section-center services-center'>
        {servicesData.map((service) => {
          return <Service {...service} key={service.id} onDelete={handleDeleteService} />
        })}
      </div>



    </section>
  )
}
export default Services