const SocialLink = ({ link, itemClass }) => {
  // function SocialLink() {
  // return <div>SocialLink</div>;
  return (
    <li key={link.id}>
      <a href={link.href} className={itemClass}>
        <i className={link.icon}></i>
      </a>
    </li>
  )

}

export default SocialLink;
