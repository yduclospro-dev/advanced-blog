export class Article {
  private _id?: string;
  private _title: string;
  private _author: string;
  private _authorId: string;
  private _date: string;
  private _content: string;
  private _imageUrl?: string;

  constructor(
    title: string,
    author: string,
    authorId: string,
    date: string,
    content: string,
    id?: string
  ) {
    this._id = id;
    this._title = title;
    this._author = author;
    this._authorId = authorId;
    this._date = date;
    this._content = content;
  }

  get id(): string | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get authorId(): string {
    return this._authorId;
  }
  get date(): string {
    return this._date;
  }

  get content(): string {
    return this._content;
  }
  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  isValidForCreation(): boolean {
    return (
      this._title.trim().length > 0 &&
      this._content.trim().length > 0 &&
      this._author.trim().length > 0
    );
  }
}