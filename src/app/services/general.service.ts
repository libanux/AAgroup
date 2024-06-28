import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService  {

  PageSizing = 20;
  storedToken: string = '';  // Initialize with an empty string
  userId: any = 0
  owner_id = ''
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.platformId = platformId;
    if (isPlatformBrowser(platformId)) {
      // runs on client / browser
      const token = localStorage.getItem('TICKET');
      this.storedToken = token !== null ? token : '';

      // userID
      this.userId = localStorage.getItem('userId')
    }
  }


  //TRUNCATE THE TEXT INTO 20 CHARS
truncateText(text: string, limit: number): string {
  if (text && text.length > limit)
     { return text.substring(0, limit) + '...';  }
    return text;
}
  
  // Function to format date
  FORMAT_DATE_WITH_HOUR(dateString: string): string {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: 'UTC' // Optional: Adjust to your timezone
    };

    return dateObj.toLocaleString('en-US', options);
  }

  FORMAT_DATE_YYYYMMDD(date: Date): string {
    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero based
    const day = ('0' + date.getDate()).slice(-2);

    // Return the formatted date string in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }


}


export const Month_Filter_Array: any[] = [
  { value: 'today', viewValue: 'Today' },
  { value: 'yesterday', viewValue: 'Yesterday' },
  { value: 'thisWeek', viewValue: 'This Week' },
  { value: 'thisMonth', viewValue: 'This Month' },
  { value: 'thisYear', viewValue: 'This Year' },
  { value: 'Calendar', viewValue: 'Custom' }
];

export const STATUS_ARRAY: any[] = [
  { value: '', viewValue: 'All' },
  { value: 'canceled', viewValue: 'Canceled' },
  { value: 'completed', viewValue: 'Completed' },
  { value: 'pending', viewValue: 'Pending' }
];

export const Download_Options: any[] = [
  { value: 'PDF', viewValue: 'PDF' },
  { value: 'Excel', viewValue: 'Excel' }
]

export const Categories: any[] =
  ['All', 'Pack', 'Visa', 'Ticketing']


  export const PRODUCT_CATEGORY_ARRAY: any[] = [
    {id: 1, CategoryName:'Category1'},
    {id: 2, CategoryName:'Category2'},
    {id: 3, CategoryName:'Category3'},
    {id: 4, CategoryName:'Category4'},
    {id: 5, CategoryName:'Category5'},
  ];
  

  export const Suppliers_ARRAY: any[] = [
    { id: 1, name: 'Supplier A' },
    { id: 2, name: 'Supplier B' },
    { id: 3, name: 'Supplier C' },
    { id: 4, name: 'Supplier D' },
    // Add more suppliers as needed
  ];

  export const STOCK_Array_Filter : any[] = [
    { value: 1, name: 'All' },
    { value: 2, name: 'Available' },
    { value: 3, name: 'Out Of Stock' }
  ]