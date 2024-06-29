export class Adjustment {
  id: string;
  dateCreation: string;
  LastModifiedTime: string;
  LastModifiedUser: string;
  adjustedItems: string;
  user: string;
  description: string;

  constructor(id: string, dateCreation: string, LastModifiedTime: string, LastModifiedUser: string, adjustedItems: string, user: string, description: string) {
      this.id = id;
      this.dateCreation = dateCreation;
      this.LastModifiedTime = LastModifiedTime;
      this.LastModifiedUser = LastModifiedUser;
      this.adjustedItems = adjustedItems;
      this.user = user;
      this.description = description;
  }
}

