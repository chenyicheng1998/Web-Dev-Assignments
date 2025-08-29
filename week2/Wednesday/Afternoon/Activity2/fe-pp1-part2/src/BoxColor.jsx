import "./BoxColor.css";

const BoxColor = ({ r, g, b }) => {
  const rgbToHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexColor = `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`;

  const textColor = r + g + b > 382 ? "black" : "white";

  return (
    <div
      className="box-color"
      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, color: textColor }}
    >
      <div className="color-text">
        <div>rgb({r},{g},{b})</div>
        <div>{hexColor.toUpperCase()}</div>
      </div>
    </div>
  );
};

export default BoxColor;
