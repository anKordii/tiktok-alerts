const alertName = function (name) {
    let source;
    switch (name) {
      case "coffe":
        source = "Kawke";
        break;
      case "diamonds":
        source = "Diamenciki";
        break;
      case "dice":
        source = "Kosteczki";
        break;
      case "kiss":
        source = "Całusy";
        break;
      case "koniczynka":
        source = "Koniczynki";
        break;
      case "rose":
        source = "Różyczki";
        break;
      case "szampan":
        source = "Szampany";
        break;
      default:
        source = "nieznany";
    }
    return source;
  };
  export default alertName;
  