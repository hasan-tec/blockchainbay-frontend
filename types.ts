export interface LinkItem {
    label: string;
    url: string;
    bgColorClass?: string;
    textColorClass?: string;
  }
  
  export interface AdditionalLink extends LinkItem {
    id: number;
  }