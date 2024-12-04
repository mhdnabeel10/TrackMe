export interface ReviewsData  {
   name: string; 
   value: number;
}
export interface SortData  {
   name: string; 
   value: number;
   department: string;
   score: number;
}
export interface Performance {
   lastUpdated: string;    
   comments: string;
   score: number;   
 }
export interface  EmployeeList{
   id:string;
   name:string;
   department:string;
   position:string;
   performance:Performance

}
  

