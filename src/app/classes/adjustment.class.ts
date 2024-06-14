import { products } from "./products.class";

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

// Example array of Adjustment objects
export const adjustments: Adjustment[] = [
  new Adjustment("1", "2024-06-16", "03:45 PM", "Mohammed Abdullah", "Labneh, Zaatar", "Mohammed", "Updated quantities after receiving new stock"),
  new Adjustment("2", "2024-06-17", "09:15 AM", "Rima Nasr", "Extra Virgin Olive Oil, Kishk", "Rima", "Made adjustments to match sales data"),
  new Adjustment("3", "2024-06-18", "02:30 PM", "Ahmed Fawaz", "Pomegranate Molasses, Falafel Mix", "Ahmed", "Adjusted prices based on market analysis"),
  new Adjustment("4", "2024-06-19", "11:00 AM", "Sarah Hussein", "Shanklish, Lebanese Rice", "Sarah", "Price adjustments to keep up with changes in raw material costs"),
  new Adjustment("5", "2024-06-20", "04:45 PM", "George Youssef", "Tahini, Mahmoul", "George", "Updated inventory to ensure availability of goods at appropriate times"),
  new Adjustment("6", "2024-06-21", "01:20 PM", "Lina Mahmoud", "Kataifi, Mouneh", "Lina", "Adjustments to human resources based on production needs"),
  new Adjustment("7", "2024-06-22", "10:30 AM", "Ali Hussein", "Sumac, Lebanese Rice", "Ali", "Adjustments to comply with new regulations in the food industry"),
  new Adjustment("8", "2024-06-23", "03:00 PM", "Rania Khoury", "Date Molasses, Lebanese Labneh Balls", "Rania", "Updates to quality standards and food safety review"),
  new Adjustment("9", "2024-06-24", "11:30 AM", "Leila Said", "Arak, Kataifi Dough", "Leila", "Made adjustments to optimize shelf space"),
  new Adjustment("10", "2024-06-25", "02:15 PM", "Elias Nasser", "Lebanese Pickles, Maamoul Mold", "Elias", "Reviewed pricing strategy for upcoming promotions"),
  new Adjustment("11", "2024-06-26", "08:45 AM", "Nour Hassan", "Date Molasses, Lebanese Labneh Balls", "Nour", "Adjusted stock levels based on seasonal demand trends"),
  new Adjustment("12", "2024-06-27", "05:00 PM", "Karim Harb", "Arak, Kataifi Dough", "Karim", "Made corrections to inventory data after system audit"),
  new Adjustment("13", "2024-06-28", "12:30 PM", "Layla Khoury", "Arak, Kataifi Dough", "Layla", "Updates to product descriptions for clarity"),
  new Adjustment("14", "2024-06-29", "09:30 AM", "Sami Gerges", "Lebanese Pickles, Maamoul Mold", "Sami", "Adjusted prices to remain competitive in the market"),
  new Adjustment("15", "2024-06-30", "03:20 PM", "Nada Mansour", "Date Molasses, Lebanese Labneh Balls", "Nada", "Made adjustments to accommodate dietary preferences"),
  new Adjustment("16", "2024-07-01", "10:00 AM", "Fadi Haddad", "Arak, Kataifi Dough", "Fadi", "Reviewed stock levels for reorder decisions"),
  new Adjustment("17", "2024-07-02", "01:45 PM", "Laila Hariri", "Lebanese Pickles, Maamoul Mold", "Laila", "Made adjustments to match inventory counts with sales data"),
  new Adjustment("18", "2024-07-03", "11:15 AM", "Wissam Saliba", "Date Molasses, Lebanese Labneh Balls", "Wissam", "Updates to product packaging based on customer feedback"),
  new Adjustment("19", "2024-07-04", "04:00 PM", "Maya Haddad", "Arak, Kataifi Dough", "Maya", "Made adjustments to reflect changes in supplier prices"),
  new Adjustment("20", "2024-07-05", "09:00 AM", "Hassan Touma", "Lebanese Pickles, Maamoul Mold", "Hassan", "Adjusted stock levels for upcoming promotions"),
];

