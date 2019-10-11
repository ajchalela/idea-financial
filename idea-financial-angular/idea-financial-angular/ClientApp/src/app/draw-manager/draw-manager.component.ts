import { Component, Input, Inject, EventEmitter, Output, DoCheck, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
    customerName: string;
    availableFunds: number;
    newBalance: number;
    creditLimit: number;
    originalBalance: number;
    originalAvailableFunds: number;
    customerId: string
}

@Component({
    selector: 'draw-manager',
    templateUrl: './draw-manager.component.html',
    styleUrls: ['./draw-manager.component.css']
})
export class DrawManagerComponent {
    drawAmount: number = 0;
    isConfirmDisabled: boolean = true;

    differ: KeyValueDiffer<string, any>;

    constructor(
        public dialogRef: MatDialogRef<DrawManagerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private differs: KeyValueDiffers,
        private _snackBar: MatSnackBar
    ) {
        this.differ = this.differs.find({}).create();
    }

    openSnackBar(message: string) {
        this._snackBar.open(message);
    }

    closeSnackBar(duration: number) {
        setTimeout(() => { this._snackBar.dismiss() }, duration);
    }

    async _handleConfirm() {

        const updatedCustomer = {
            id: this.data.customerId,
            customerName: this.data.customerName,
            availableFunds: this.data.availableFunds,
            creditLimit: this.data.creditLimit,
            balance: this.data.newBalance
        };
        console.log('_handleConfirm', updatedCustomer);

        try {
            const response = await fetch(`https://idea-financial-server.azurewebsites.net/api/customers/${this.data.customerId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCustomer)
            });

            console.log('response', response);
            if (response.status === 204) {
                this.openSnackBar('Amount Successfully Drawn!');
                this.data.originalBalance = this.data.newBalance;
                this.data.originalAvailableFunds = this.data.availableFunds;
                this.drawAmount = 0;
                this.dialogRef.close();
                setTimeout(() => { this._snackBar.dismiss() }, 3000);
            }
            else {
                this.openSnackBar('Error making draw! Please try again!');
                this.closeSnackBar(5000);
                console.error('Error: ', response);
            }
        } catch (e) {
            this.openSnackBar('Error making draw! Please try again!');
            this.closeSnackBar(5000);
            console.error('Error: ', e);
        }
    }

    _handleDecline() {
        this.data.newBalance = this.data.originalBalance;
        this.data.availableFunds = this.data.originalAvailableFunds;
        this.dialogRef.close();
    }

    ngDoCheck() {
        const change = this.differ.diff(this);
        if (change) {
            change.forEachChangedItem(item => {
                if (item.key === 'drawAmount') {
                    const drawAmount = item.currentValue ? item.currentValue : 0;
                    if (typeof drawAmount === 'number' && drawAmount >= 0) {
                        this.data.newBalance = this.data.originalBalance + drawAmount;
                        this.data.availableFunds = this.data.originalAvailableFunds - drawAmount;
                        this.isConfirmDisabled = (drawAmount === 0 || this.data.availableFunds < 0);
                    } else {
                        this.isConfirmDisabled = true;
                    }

                }
            });
        }
    }

}