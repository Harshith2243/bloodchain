require('dotenv').config();

const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');

// ✅ FIXED: correct Web3 import
const Web3 = require('web3');


// 🔍 Check required env variables
const required = ['PRIVATE_KEY', 'RPC_URL', 'NETWORK_ID'];
required.forEach(key => {
if (!process.env[key]) {
process.exit(1);
}
});

// ✅ Create Web3 instance
const web3 = new Web3(process.env.RPC_URL);

// 🔐 Setup account from private key
const privateKey = process.env.PRIVATE_KEY.startsWith('0x')
? process.env.PRIVATE_KEY
: `0x${process.env.PRIVATE_KEY}`;

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
global.account = account.address;


// 📦 Load contract JSON
const contractJSON = require(path.join(__dirname, '../blockchain/build/contracts/Request.json'));

// 🌐 Network setup
const networkId = process.env.NETWORK_ID;
const address   = contractJSON.networks[networkId]?.address;

if (!address) {
process.exit(1);
}

// 🌍 Global access
global.web3 = web3;
global.Contractinstance = new web3.eth.Contract(contractJSON.abi, address);


// 🚀 Express app setup
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 📌 Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// ❌ 404 handler
app.use((req, res, next) => next(createError(404)));

// ⚠️ Error handler
app.use((err, req, res, next) => {
const isDev = req.app.get('env') === 'development';
res.status(err.status || 500);

if (req.path.startsWith('/api')) {
return res.json({
error: err.message,
...(isDev && { stack: err.stack })
});
}

res.locals.message = err.message;
res.locals.error   = isDev ? err : {};
res.render('error');
});

module.exports = app;
