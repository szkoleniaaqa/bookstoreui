import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from "./book.service";
import {Book} from "./book";
import {HttpErrorResponse} from "@angular/common/http";
import {CartItem} from "./cartItem";
import {NgForm} from "@angular/forms";
import {OrderService} from "./order.service";
import {AuthorService} from "./author.service";
import {Author} from "./author";
import {Order} from "./order";
import {OrderDetails} from "./orderDetails";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bookstoreui';
  public books: Book[] = [];
  public admin_books: Book[] = [];
  public authors: Author[] = [];
  public orders: OrderDetails[] = [];
  public currentAuthor: Author | undefined;
  public currentAuthorFirstName: string | undefined;
  public currentAuthorLastName: string | undefined;
  public currentAuthorId: any;

  public currentBook: Book | undefined;
  public currentBookTitle: string | undefined;
  public currentBookPrice: number | undefined;
  public currentBookYear: number | undefined;
  public currentBookAvailable: number | undefined;
  public currentBookAuthors: Author[] | undefined = [];
  public currentBookId: any;

  public cartItems: CartItem[] = [];
  confirmationMessage: any;
  errorMessage: any;

  constructor(private bookService: BookService,
              private orderService: OrderService,
              private authorService: AuthorService) {
  }

  // OPEN MODAL
  public onOpenModal(mode: string): void {
    this.confirmationMessage = null;
    this.errorMessage = null;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'cart') {
      button.setAttribute('data-target', '#cartModal');
    }
    if (mode === 'order') {
      button.setAttribute('data-target', '#orderModal');
    }
    if (mode === 'createAuthorModal') {
      button.setAttribute('data-target', '#createAuthorModal');
    }
    if (mode === 'editAuthorModal') {
      button.setAttribute('data-target', '#editAuthorModal');
    }
    if (mode === 'authorsModal') {
      button.setAttribute('data-target', '#authorsModal');
      this.getAuthors();
    }
    if (mode === 'booksModal') {
      button.setAttribute('data-target', '#booksModal');
      this.admin_getBooks();
      this.getAuthors();
    }
    if (mode === 'ordersModal') {
      button.setAttribute('data-target', '#ordersModal');
      this.getOrders();
    }
    if (mode === 'createBookModal') {
      button.setAttribute('data-target', '#createBookModal');
      this.getAuthors();
    }
    if (mode === 'editBookModal') {
      button.setAttribute('data-target', '#editBookModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }

  // BOOKS
  public getBooks(): void {
    this.bookService.getBooks().subscribe(
      (response: Book[]) => {
        console.log("Got book list:");
        console.log(response);
        this.books = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public admin_getBooks(): void {
    this.bookService.admin_getBooks().subscribe(
      (response: Book[]) => {
        console.log("Got book list:");
        console.log(response);
        this.admin_books = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public onDeleteBookSubmit(id: number): void {
    this.bookService.deleteBook(id)
      .subscribe(
        (response: any) => {
          this.confirmationMessage = "Książka usunięta pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas usuwania książki!"
        }
      )
  }

  public onEditBookClicked(id: number) {
    this.currentBook = this.books.find((b) => {
      return b.id === id
    });

    this.currentBookTitle = this.currentBook?.title
    this.currentBookPrice = this.currentBook?.price
    this.currentBookAvailable = this.currentBook?.available
    this.currentBookYear = this.currentBook?.year
    this.currentBookAuthors = this.currentBook?.authors
    this.currentBookId = id;
    this.onOpenModal("editBookModal");
  }

  public onEditBookSubmit(id: number, editBookForm: NgForm): void {
    // @ts-ignore
    document.getElementById('cancel-order-button').click();
    // @ts-ignore
    document.getElementById('close-cart-button').click();
    console.log("Received form: {}")

    this.bookService.editBook(id, editBookForm.value)
      .subscribe(
        (response: any) => {
          console.log(editBookForm.value)
          console.log("Edit author submitted")
          this.confirmationMessage = "Dane książki zaktualizowane pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas aktualizacji książki!"
        }
      )
  }

  public onCreateBookSubmit(createBookForm: NgForm): void {
    // @ts-ignore
    document.getElementById('cancel-order-button').click();
    // @ts-ignore
    document.getElementById('close-cart-button').click();
    console.log("Received form: {}")

    this.bookService.createBook(createBookForm.value)
      .subscribe(
        (response: any) => {
          console.log("Book submitted")
          createBookForm.reset();
          this.confirmationMessage = "Książka dodana pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas dodawania książki!"
        }
      )
  }

  public addToCart(book: Book): void {
    // @ts-ignore
    const current: CartItem = this.cartItems.find(x => x.book.id === book.id);
    if (current) {
      current.quantity += 1;
    } else {
      this.cartItems.push({book: book, quantity: 1} as CartItem);
    }
    console.log('Cart is: ' + JSON.stringify(this.cartItems));
  }

  public countCartItems(): number {
    return this.cartItems
      .reduce((sum, current) => sum + current.quantity, 0);
  }

  public totalCartAmount(): number {
    return this.cartItems
      .reduce((sum, current) => sum + current.book.price * current.quantity, 0);
  }

  public clearCart(): void {
    this.cartItems = []
  }

  public onOrderSubmit(orderForm: NgForm): void {
    // @ts-ignore
    document.getElementById('cancel-order-button').click();
    // @ts-ignore
    document.getElementById('close-cart-button').click();
    console.log("Received form: {}")
    this.orderService.createOrder(orderForm.value, this.cartItems)
      .subscribe(
        (response: any) => {
          console.log("Order submitted")
          this.clearCart();
          this.confirmationMessage = "Zamówienie złożone pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
          this.errorMessage = "Wystąpił problem podczas skłądania zamówienia!"
        }
      )
  }

  // AUTHORS
  public getAuthors(): void {
    this.authorService.getAuthors().subscribe(
      (response: Author[]) => {
        console.log("Got author list:");
        console.log(response);
        this.authors = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public onDeleteAuthor(id: string) {
    this.authorService.getAuthors();
  }

  public onEditAuthorClicked(id: number) {
    this.currentAuthor = this.authors.find((a) => {
      return a.id === id
    })
    this.currentAuthorFirstName = this.currentAuthor?.firstName
    this.currentAuthorLastName = this.currentAuthor?.lastName
    this.currentAuthorId = id
    this.onOpenModal("editAuthorModal");
  }

  public onCreateAuthorSubmit(createAuthorForm: NgForm): void {
    // @ts-ignore
    document.getElementById('cancel-order-button').click();
    // @ts-ignore
    document.getElementById('close-cart-button').click();
    console.log("Received form: {}")

    this.authorService.createAuthor(createAuthorForm.value)
      .subscribe(
        (response: any) => {
          createAuthorForm.reset();
          this.confirmationMessage = "Autor utworzony pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas tworzenia autora!"
        }
      )
  }

  public onEditAuthorSubmit(id: number, editAuthorForm: NgForm): void {
    // @ts-ignore
    document.getElementById('cancel-order-button').click();
    // @ts-ignore
    document.getElementById('close-cart-button').click();
    console.log("Received form: {}")

    this.authorService.editAuthor(id, editAuthorForm.value)
      .subscribe(
        (response: any) => {
          console.log(editAuthorForm.value)
          console.log("Edit author submitted")
          editAuthorForm.reset();
          this.confirmationMessage = "Dane autora zaktualizowane pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas aktualizacji danych autora!"
        }
      )
  }

  public onDeleteAuthorSubmit(id: number): void {
    this.authorService.deleteAuthor(id)
      .subscribe(
        (response: any) => {
          this.confirmationMessage = "Autor usunięty pomyślnie!"
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = "Wystąpił problem podczas usuwania autora!"
        }
      )
  }

  public countBooks(): number {
    return this.books.length;
  }

  public countAdminBooks(): number {
    return this.admin_books.length;
  }

  public countAuthors(): number {
    return this.authors.length;
  }

  // ORDERS
  public getOrders(): void {
    this.orderService.getOrders().subscribe(
      (response: OrderDetails[]) => {
        console.log(response);
        this.orders = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public countOrders(): number {
    return this.orders.length;
  }

  // INIT APP
  ngOnInit(): void {
    this.getOrders();
    this.getAuthors();
    this.getBooks();
  }
}
