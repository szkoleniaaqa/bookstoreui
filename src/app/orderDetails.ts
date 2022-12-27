import {OrderItemDetails} from "./orderItemDetails";
import {Recipient} from "./recipient";

export interface OrderDetails {
  id: number;
  status: string;
  items: OrderItemDetails[];
  recipient: Recipient;
}
