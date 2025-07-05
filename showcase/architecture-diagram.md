# xAPT Showcase Architecture Diagram

## System Overview

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer"
        DC[Demo Client<br/>Basic SDK Demo]
        RBC[Real Blockchain Client<br/>Real APT Transactions]
        SW[Smart Wallet Adapter<br/>Auto-Refill Logic]
        RWA[Real Aptos Wallet Adapter<br/>Blockchain Interface]
    end

    %% SDK Layer
    subgraph "xAPT SDK"
        XC[xAPT Client<br/>HTTP 402 Handler]
        XS[xAPT Server<br/>Payment Middleware]
        XCOM[xAPT Common<br/>Types & Utils]
    end

    %% Server Layer
    subgraph "Server Layer"
        DS[Demo Server<br/>Payment Tiers]
        SF[Simple Facilitator<br/>Payment Verification]
        PM[Payment Middleware<br/>402 Responses]
    end

    %% Blockchain Layer
    subgraph "Aptos Blockchain"
        AN[Aptos Nodes<br/>RPC Endpoints]
        AT[Aptos Testnet<br/>Real APT Tokens]
    end

    %% Wallet Layer
    subgraph "Wallet Management"
        SW1[Spending Wallet<br/>0x54aac012...]
        SW2[Saving Wallet<br/>0x03aaf1fd...]
        AR[Auto-Refill Logic<br/>Balance Monitoring]
    end

    %% Connections
    DC --> XC
    RBC --> XC
    SW --> RWA
    RWA --> XC
    
    XC --> XCOM
    XS --> XCOM
    
    DS --> XS
    DS --> PM
    PM --> SF
    
    RWA --> AN
    AN --> AT
    
    SW --> AR
    AR --> SW1
    AR --> SW2
    SW1 --> AT
    SW2 --> AT

    %% Styling
    classDef clientLayer fill:#e1f5fe
    classDef sdkLayer fill:#f3e5f5
    classDef serverLayer fill:#e8f5e8
    classDef blockchainLayer fill:#fff3e0
    classDef walletLayer fill:#fce4ec

    class DC,RBC,SW,RWA clientLayer
    class XC,XS,XCOM sdkLayer
    class DS,SF,PM serverLayer
    class AN,AT blockchainLayer
    class SW1,SW2,AR walletLayer
```

## Payment Flow Sequence

```mermaid
sequenceDiagram
    participant Client as Demo Client
    participant SDK as xAPT Client
    participant Server as Demo Server
    participant Middleware as Payment Middleware
    participant Facilitator as Simple Facilitator
    participant Blockchain as Aptos Blockchain

    Client->>Server: GET /api/premium/data
    Server->>Middleware: Check Payment Required
    Middleware->>Client: HTTP 402 Payment Required<br/>{amount: "0.1", recipient: "0x03aaf1fd..."}
    
    Client->>SDK: handlePaymentRequired(response)
    SDK->>Blockchain: Create APT Transfer Transaction
    Blockchain->>SDK: Transaction Hash
    
    SDK->>Facilitator: POST /verify-payment
    Facilitator->>SDK: {isValid: true, transactionHash: "0x..."}
    
    SDK->>Server: GET /api/premium/data (retry)
    Server->>Client: 200 OK + Premium Data
```

## Smart Wallet Auto-Refill Flow

```mermaid
sequenceDiagram
    participant Client as Real Blockchain Client
    participant SmartWallet as Smart Wallet Adapter
    participant Spending as Spending Wallet
    participant Saving as Saving Wallet
    participant Blockchain as Aptos Blockchain

    Client->>SmartWallet: Request Payment (0.1 APT)
    SmartWallet->>Spending: Check Balance
    Spending->>Blockchain: GET /accounts/{address}/resource/CoinStore
    Blockchain->>Spending: Balance: 0.05 APT (Low)
    
    SmartWallet->>Saving: Check Savings Balance
    Saving->>Blockchain: GET /accounts/{address}/resource/CoinStore
    Blockchain->>Saving: Balance: 2.5 APT (Sufficient)
    
    SmartWallet->>Saving: Transfer 1.0 APT to Spending
    Saving->>Blockchain: POST /transactions (Transfer)
    Blockchain->>Saving: Transaction Hash: 0xabc123...
    
    SmartWallet->>Spending: Retry Original Payment (0.1 APT)
    Spending->>Blockchain: POST /transactions (Payment)
    Blockchain->>Spending: Transaction Hash: 0xdef456...
    
    SmartWallet->>Client: Payment Complete ✅
```

## Component Relationships

```mermaid
graph LR
    subgraph "Client Applications"
        DC[Demo Client]
        RBC[Real Blockchain Client]
    end

    subgraph "Wallet Management"
        SW[Smart Wallet Adapter]
        RWA[Real Aptos Wallet]
    end

    subgraph "xAPT SDK"
        XC[Client SDK]
        XS[Server SDK]
    end

    subgraph "Server Infrastructure"
        DS[Demo Server]
        SF[Facilitator]
    end

    subgraph "Blockchain"
        AT[Aptos Testnet]
    end

    DC --> XC
    RBC --> XC
    SW --> RWA
    RWA --> XC
    XC --> XS
    DS --> XS
    DS --> SF
    RWA --> AT
```

## Key Features Overview

```mermaid
mindmap
  root((xAPT Showcase))
    HTTP 402 Payments
      Automatic Response Handling
      Payment Retry Logic
      Transaction Verification
    Smart Wallet
      Auto-Refill from Savings
      Balance Monitoring
      Daily Limits
      Transaction History
    Multiple Payment Tiers
      Public (Free)
      Premium (0.1 APT)
      Enterprise (0.5 APT)
      Subscription (0.1 APT)
    Real Blockchain Integration
      Aptos Testnet
      Real APT Tokens
      On-chain Verification
      Transaction Confirmation
    Production Ready
      Error Handling
      Retry Logic
      Health Monitoring
      Configurable Rules
```

## Data Flow Architecture

```mermaid
flowchart TD
    A[User Request] --> B{Payment Required?}
    B -->|No| C[Process Request]
    B -->|Yes| D[Return HTTP 402]
    
    D --> E[Client Handles 402]
    E --> F[Create Payment Transaction]
    F --> G[Submit to Blockchain]
    G --> H[Verify Payment]
    H --> I{Payment Valid?}
    
    I -->|No| J[Payment Failed]
    I -->|Yes| K[Retry Original Request]
    K --> C
    
    C --> L[Return Response]
    J --> M[Error Response]
    
    subgraph "Smart Wallet Logic"
        N[Check Spending Balance]
        O{Balance Low?}
        P[Check Savings Balance]
        Q{Sufficient Savings?}
        R[Auto-Refill from Savings]
        S[Retry Payment]
    end
    
    F --> N
    O -->|Yes| P
    Q -->|Yes| R
    R --> S
    S --> F
```

This architecture demonstrates a complete HTTP 402 Payment Required system with smart wallet functionality, real blockchain integration, and production-ready features. 