import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawManagerComponent } from '../draw-manager/draw-manager.component';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent {
    @Input() customerName: string;
    @Input() balance: number;
    @Input() availableFunds: number;
    @Input() creditLimit: number;
    @Input() customerId: string;
    isDrawBtnDisabled = false;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) { }

    openSnackBar(message: string) {
        this._snackBar.open(message);
    }

    closeSnackBar(duration: number) {
        setTimeout(() => { this._snackBar.dismiss() }, duration);
    }

    async _fetchCustomerInfo() {
        try {
            const response = await fetch('https://idea-financial-server.azurewebsites.net/api/customers');
            if (response.status === 200) {
                const customerArray = await response.json();
                const customer = customerArray.length ? customerArray[0] : {};

                if (Object.keys(customer).length) {
                    this.customerName = customer.customerName;
                    this.balance = customer.balance;
                    this.availableFunds = customer.availableFunds;
                    this.creditLimit = customer.creditLimit;
                    this.customerId = customer.id;
                    console.log(`updated values:\nname: ${this.customerName}\nbalance: ${this.balance}\navailable funds: ${this.availableFunds}\ncredit limit: ${this.creditLimit}`)
                }
                console.log('customer', customer);
            }
            else {
                this.openSnackBar('Unable to fetch customer info for database! Please check connections and try again!');
                this.closeSnackBar(5000);
            }
        } catch (e) {
            this.openSnackBar('Unable to fetch customer info for database! Please check connections and try again!');
            this.closeSnackBar(5000);
            console.error('Error: ', e);
        }
    }

    ngOnInit() {
        this._fetchCustomerInfo();
    }

    _handleDraw(): void {
        console.log('_handleDrawClick()');
        const dialogRef = this.dialog.open(DrawManagerComponent,
            {
                width: "40vw",
                maxWidth: "500px",
                data:
                {
                    customerName: this.customerName,
                    newBalance: this.balance,
                    availableFunds: this.availableFunds,
                    creditLimit: this.creditLimit,
                    originalBalance: this.balance,
                    originalAvailableFunds: this.availableFunds,
                    customerId: this.customerId
                }
            }
        );
        dialogRef.afterClosed().subscribe(() => {
            this.balance = dialogRef.componentInstance.data.newBalance;
            this.availableFunds = dialogRef.componentInstance.data.availableFunds;
            this.isDrawBtnDisabled = this.availableFunds === 0 ? true : false;
        })
    }
}
