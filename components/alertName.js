const alertName = function (name) {
    let source;
    switch (name) {
      case "coffe":
        source = "Kawki";
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
      case "lean":
        source = "lean";
        break;
      case "ziolo":
        source = "ziolo";
        break;
      default:
        source = "nieznany";
    }
    return source;
  };
  export default alertName;
  