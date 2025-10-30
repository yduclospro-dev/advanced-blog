export class Article {
  public id: string;
  public title: string;
  public author: string;
  public authorId: string;
  public date: string;
  public content: string;
  public imageUrl?: string;

  constructor(
    id: string,
    title: string,
    author: string,
    authorId: string,
    date: string,
    content: string,
    imageUrl?: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.date = date;
    this.content = content;
    this.imageUrl = imageUrl;
  }

  isValidForCreation(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.content.trim().length > 0 &&
      this.author.trim().length > 0
    );
  }
}
