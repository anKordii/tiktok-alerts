const alertImage = function (name) {
  let source;
  switch (name) {
    case "coffe":
      source = "coffe.gif";
      break;
    case "diamonds":
      source = "diamonds.gif";
      break;
    case "dice":
      source = "dice.gif";
      break;
    case "kiss":
      source = "kiss.gif";
      break;
    case "koniczynka":
      source = "koniczynki.gif";
      break;
    case "rose":
      source = "rose.gif";
      break;
    case "szampan":
      source = "szampan.gif";
      break;
    default:
      source = "unknown.gif";
  }
  return source;
};
export default alertImage;
