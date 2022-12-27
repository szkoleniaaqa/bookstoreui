import {Recipient} from "./recipient";
import {OrderItem} from "./orderItem";

export interface Order {
  recipient: Recipient;
  items: OrderItem[];
}
