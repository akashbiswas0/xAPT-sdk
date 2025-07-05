// Example usage of xAPT client in browser
// Note: This is a demonstration - actual implementation would require
// proper wallet integration and build setup

class ExampleClient {
    constructor() {
        this.logs = document.getElementById('logs');
        this.walletStatus = document.getElementById('walletStatus');
        this.paymentStatus = document.getElementById('paymentStatus');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });

        document.getElementById('disconnectWallet').addEventListener('click', () => {
            this.disconnectWallet();
        });

        document.getElementById('testPayment').addEventListener('click', () => {
            this.testPayment();
        });
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        this.logs.appendChild(logEntry);
        this.logs.scrollTop = this.logs.scrollHeight;
    }

    async connectWallet() {
        try {
            this.log('Connecting to wallet...', 'info');
            this.walletStatus.textContent = 'Connecting...';
            this.walletStatus.className = 'status info';
            
            // In a real implementation, this would integrate with a wallet adapter
            // For now, we'll simulate the connection
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.walletStatus.textContent = 'Wallet connected';
            this.walletStatus.className = 'status success';
            this.log('Wallet connected successfully', 'success');
        } catch (error) {
            this.walletStatus.textContent = 'Connection failed';
            this.walletStatus.className = 'status error';
            this.log(`Wallet connection failed: ${error.message}`, 'error');
        }
    }

    async disconnectWallet() {
        try {
            this.log('Disconnecting wallet...', 'info');
            this.walletStatus.textContent = 'Disconnecting...';
            this.walletStatus.className = 'status info';
            
            // Simulate disconnection
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.walletStatus.textContent = 'Wallet disconnected';
            this.walletStatus.className = 'status info';
            this.log('Wallet disconnected', 'info');
        } catch (error) {
            this.log(`Wallet disconnection failed: ${error.message}`, 'error');
        }
    }

    async testPayment() {
        try {
            this.log('Testing payment request...', 'info');
            this.paymentStatus.textContent = 'Processing payment...';
            this.paymentStatus.className = 'status info';

            // Simulate a payment request that returns 402
            const mockResponse = {
                status: 402,
                headers: new Headers({
                    'X-Aptos-Payment-Required': JSON.stringify({
                        x402Version: 1,
                        paymentId: '123e4567-e89b-12d3-a456-426614174000',
                        amount: '0.01',
                        tokenAddress: '0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832::usdc::USDC',
                        recipientAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                        network: 'testnet',
                        description: 'Test payment for premium content'
                    })
                })
            };

            this.log('Received 402 Payment Required response', 'info');
            this.log('Payment details: 0.01 USDC to test recipient', 'info');
            
            // Simulate transaction signing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.log('Transaction signed successfully', 'success');
            this.log('Payment completed', 'success');
            
            this.paymentStatus.textContent = 'Payment completed successfully';
            this.paymentStatus.className = 'status success';
            
        } catch (error) {
            this.paymentStatus.textContent = 'Payment failed';
            this.paymentStatus.className = 'status error';
            this.log(`Payment failed: ${error.message}`, 'error');
        }
    }
}

// Initialize the example when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ExampleClient();
}); 