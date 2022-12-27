import {OrderBookDetails} from "./orderBookDetails";

export interface OrderItemDetails {
  id: number;
  book: OrderBookDetails;
  quantity: number;
}
