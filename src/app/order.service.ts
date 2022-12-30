import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Order} from "./order";
import {Recipient} from "./recipient";
import {CartItem} from "./cartItem";
import {OrderItem} from "./orderItem";
import {OrderDetails} from "./orderDetails";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiServerUrl = environment.API_URL;

  constructor(private http: HttpClient) {
  }

  public createOrder(recipient: Recipient, cartItems: CartItem[]): Observable<any> {
    const orderItems: OrderItem[] = cartItems.map(item => {
      return {bookId: item.book.id, quantity: item.quantity} as OrderItem;
    });
    const order: Order = {recipient: recipient, items: orderItems} as Order
    console.log(order)
    return this.http.post(`${this.apiServerUrl}/orders`, order)
  }

  public getOrders(): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${this.apiServerUrl}/orders`);
  }
}
