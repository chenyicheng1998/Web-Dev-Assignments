import visa from "./assets/images/visa.png";
import masterCard from "./assets/images/master-card.svg";

import "./CreditCard.css"


const CreditCard = (props) => {
  const cardLogo = props.type === "Visa" ? visa : masterCard;
  const maskedNumber = `•••• •••• •••• ${props.number.slice(-4)}`;
  const formattedMonth = props.expirationMonth.toString().padStart(2, "0");

  return (
    <div
      className="credit-card"
      style={{ backgroundColor: props.bgColor, color: props.color }}
    >
      <div className="credit-card-type">
        <img src={cardLogo} alt={props.type} />
      </div>
      <div className="credit-card-number">{maskedNumber}</div>
      <div className="credit-card-details">
        <span>
          Expires {formattedMonth}/{props.expirationYear.toString().slice(-2)}
        </span>
        <span className="bank">{props.bank}</span>
      </div>
      <div className="credit-card-owner">{props.owner}</div>
    </div>
  );
}

export default CreditCard;



