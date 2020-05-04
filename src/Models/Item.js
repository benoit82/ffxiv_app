export default class Item {
  /**
   *
   * @param {data} data data from request
   * @param {string} param1 defaut option : "fr"
   */
  constructor(data, lang = "fr") {
    lang = lang.toLowerCase().trim();

    this.id = data.ID;
    this.icon = data.Icon;
    // langage management
    switch (lang) {
      case "fr":
        this.name = data.Name_fr;
        this.description = data.Description_fr;
        break;
      case "en":
        this.name = data.Name_en;
        this.description = data.Description_en;
        break;
      case "de":
        this.name = data.Name_de;
        this.description = data.Description_de;
        break;
      case "ja":
        this.name = data.Name_ja;
        this.description = data.Description_ja;
        break;
      default:
        break;
    }
  }
}
