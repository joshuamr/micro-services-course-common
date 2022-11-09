export enum OrderStatus {
    // order has been created but the ticket has not been reserved
    Created = 'created',

    // the ticket the order is trying to reserve has already been reserved
    // or the order is canceled
    // or the order has expired
    Canceled = 'canceled',

    // the order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // the order has reserved the ticket and the user has
    // provided payment successfully
    Complete = 'complete'
}