
interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  businessName: string;
  walletAddress: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentReference: string;
  message: string;
  processingTime: number;
}

export class MockPaymentService {
  static async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    const startTime = Date.now();
    
    // Simulate network delay
    const processingDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, processingDelay));
    
    // Simulate payment success/failure (95% success rate)
    const isSuccess = Math.random() > 0.05;
    
    if (!isSuccess) {
      return {
        success: false,
        transactionId: '',
        paymentReference: '',
        message: 'Payment failed. Please try again.',
        processingTime: Date.now() - startTime
      };
    }

    // Generate mock transaction details
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const paymentReference = `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    return {
      success: true,
      transactionId,
      paymentReference,
      message: `Payment of ${paymentData.currency} ${paymentData.amount.toLocaleString()} processed successfully`,
      processingTime: Date.now() - startTime
    };
  }

  static async validatePayment(transactionId: string): Promise<boolean> {
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real system, this would verify the transaction with the payment provider
    return transactionId.startsWith('TXN-');
  }

  static generateMockBlockchainHash(): string {
    // Generate a mock blockchain transaction hash
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  static calculateNetworkFee(amount: number): number {
    // Simulate network fee calculation (0.1% of transaction amount, minimum 10 BTN)
    return Math.max(amount * 0.001, 10);
  }

  static async simulateBlockchainConfirmation(transactionId: string): Promise<{
    confirmed: boolean;
    blockHash: string;
    confirmationTime: number;
  }> {
    // Simulate blockchain confirmation delay
    const confirmationDelay = Math.random() * 3000 + 2000; // 2-5 seconds
    await new Promise(resolve => setTimeout(resolve, confirmationDelay));
    
    return {
      confirmed: true,
      blockHash: this.generateMockBlockchainHash(),
      confirmationTime: Date.now()
    };
  }
}

export default MockPaymentService;
