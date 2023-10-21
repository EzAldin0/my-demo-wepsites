'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-10-09T12:01:20.894Z',
    '2023-10-15T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-09-15T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'EzAldin Ramadan',
  movements: [200, -200, 340, -300, -20, 50, 400, 4600],
  interestRate: 1.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-10-15T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-eg',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatmovementsDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const dayPassed = calcDaysPassed(new Date(), date);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    // const yearD = date.getFullYear();
    // const monthD = `${date.getMonth() + 1}`.padStart(2, 0);
    // const dayD = `${date.getDate()}`.padStart(2, 0);

    // return `${dayD}/${monthD}/${yearD}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const processtype = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatmovementsDates(date, acc.locale);
    // const formattedmov = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);
    const formattedmov = formatCurrency(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${processtype}">${
      i + 1
    } ${processtype}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedmov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const calcDisplayBalanc = function (acc) {
  acc.balance = acc.movements.reduce((total, mov) => (total += mov), 0);
  const formatedBalance = formatCurrency(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = formatedBalance;
};

const calcDisplaySummary = function (acc) {
  const movements = acc.movements;
  const summaryIN = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const summaryOut = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = formatCurrency(summaryIN, acc.locale, acc.currency);
  labelSumOut.textContent = formatCurrency(
    Math.abs(summaryOut),
    acc.locale,
    acc.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};
///--------
const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUsernames(accounts);
//-------------
const UpdateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalanc(acc);
  calcDisplaySummary(acc);
};

const logOutTimer = function () {
  const timer = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  let time = 180;
  timer();
  const timeLeft = setInterval(timer, 1000);
  return timeLeft;
};
let currentAccount, timeLeft;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (!currentAccount) alert('incorrect username');
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    
    
    const now = new Date();
    const dateOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      dateOptions
    ).format(now);
    // const yearD = now.getFullYear();
    // const monthD = `${now.getMonth() + 1}`.padStart(2, 0);
    // const dayD = `${now.getDate()}`.padStart(2, 0);
    // const hourD = `${now.getHours()}`.padStart(2, 0);
    // const minutesD = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${dayD}/${monthD}/${yearD} , ${hourD}:${minutesD}`;
    if(timeLeft)clearInterval(timeLeft);
    timeLeft=logOutTimer();
    UpdateUI(currentAccount);
  } else alert('incorrect PIN');
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    UpdateUI(currentAccount);
    clearInterval(timeLeft);
    timeLeft=logOutTimer();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    ///---------
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      UpdateUI(currentAccount);
    }, 4000);
    clearInterval(timeLeft);
    timeLeft=logOutTimer();
    //------------
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(Number.parseFloat('25.5rem'));

// console.log(Number.isFinite('73'));
// console.log(Number.isFinite('73oct'));
// console.log(Number.isFinite('x73'));
// console.log(Number.isFinite(73));

// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// console.log(Math.max(...movements));
// console.log(Math.max('2', '5'));
// console.log(Math.min(...movements));

// const randomInt = (max, min) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // console.log(randomInt(5,1));

// console.log(Math.round('2.8'));
// console.log(Math.round(2.3));

// console.log(Math.trunc(2.3));
// console.log(Math.trunc(-2.3));
// //go to the upper number
// console.log(Math.ceil(2.3));
// console.log(Math.ceil(-2.3));

// console.log(Math.floor(2.3));
// console.log(Math.floor(-2.3));

// console.log(+(2.74565).toFixed(2));

/////////////////////////////////////////////////
// const now = new Date();
// console.log(now);
// console.log(new Date(2002, 10 - 1, 12));
// console.log(new Date(2005, 10 - 1, 20,12,15));

// const locale = navigator.language;
// console.log(locale);
// setInterval(() => {
//   const now45 = new Date();
// const dateOptions = {
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric',
// };
//   const time = new Intl.DateTimeFormat(
//     account2.locale,
//     dateOptions
//   ).format(now45);
//   labelTimer.textContent=time;
// }, 1000);
