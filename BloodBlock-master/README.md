# BloodBlock - A Blood Donor Chain

A blockchain-based Blood Donation Management System ; The dApp is created to make the blood donation transparent and decentralised. It helps us to know
whether the blood donated reaches the needed and also donate blood as per request so that there is no blood wastage and spoilage.

### System requirements:

1. Operating system: Ubuntu 16.04
2. System RAM: 4 GB or above (recommended 8 GB)
3. Free System storage: 4 GB on /home

## Installation Prerequisites:

1. Ensure that NodeJS is installed in the system. For more information about NodeJS, go to https://nodejs.org. To check if installed, open a terminal window:

```
node -v
```

2. If NodeJS is not installed, go to https://nodejs.org and download the compatible version based on system OS, or in a terminal window:

```
sudo apt-get install -y nodejs
```

3. Ensure that Truffle is installed. Truffle Suite helps to develop Dapps easily. For more information, go to https://truffleframework.com/. To check if installed, in terminal window:

```
truffle version
```

4. If Truffle is not installed, in terminal window:

```
npm install -g truffle
```

5. Ensure that geth is installed. Geth is the official Golang implementation of the Ethereum protocol. To check, in a terminal window:

```
geth version
```

6. To install geth, in a terminal window:

```
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

## Running on Windows (Verified)

If you are running on Windows, use the following steps:

1. **Start the Blockchain Node**:
   Open a terminal in the root directory and run:

   ```powershell
   geth --datadir "privatechain/node1" --syncmode "full" --port 30311 --http --http.port 8545 --http.api "personal,db,eth,net,web3,txpool,miner" --networkid 4002 --unlock 1ac013d849c86f23f2e95eb4e68cbc20bf97dc93 --password privatechain/password.txt --allow-insecure-unlock
   ```

2. **Start the Web Server**:
   Open a second terminal in the `bdc` directory and run:

   ```powershell
   npm install
   npm start
   ```

3. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Demo

A demonstration of the project's workflow (Donor Registration and Search) after the blockchain fix:

![BloodBlock Success Verification](file:///C:/Users/Harshith/.gemini/antigravity/brain/312b828b-0d06-4150-9f89-2e0ff8cb467c/donor_details_verification_1774191294232.png)

> [!NOTE]
> For a detailed walkthrough of the changes and verification steps, see the [Walkthrough](file:///C:/Users/Harshith/.gemini/antigravity/brain/312b828b-0d06-4150-9f89-2e0ff8cb467c/walkthrough.md).
