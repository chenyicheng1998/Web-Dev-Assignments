import { socialLinks } from '../data'
import SocialLink from './SocialLink'


// function SocialLinks() {
//   return <div>SocialLinks</div>;
const SocialLinks = ({ parentClass, itemClass }) => {
  return (
    <ul className={parentClass} id='nav-links'>
      {socialLinks.map((link) => {
        return <SocialLink key={link.id} link={link} itemClass={itemClass} />
      })}
    </ul>
  )
}

export default SocialLinks;
