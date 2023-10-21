'use strict';
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEL = document.querySelector('.dice');
const btnnew = document.querySelector('.btn--new');
const btnroll = document.querySelector('.btn--roll');
const btnhold = document.querySelector('.btn--hold');

let Activeplayer, currentscore, scores, playing;
let win=[0,0];
const initialpoint = function () {
  Activeplayer = 0;
  currentscore = 0;
  scores = [0, 0];
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEL.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};
initialpoint();

const switchplayer = function () {
  document.getElementById(`current--${Activeplayer}`).textContent = 0;
  currentscore = 0;
  Activeplayer = Activeplayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

btnroll.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEL.classList.remove('hidden');
    diceEL.src = `dice-${dice}.png`;
    if (dice !== 1) {
      currentscore += dice;
      document.getElementById(`current--${Activeplayer}`).textContent =
        currentscore;
    } else {
      switchplayer();
    }
  }
});

btnhold.addEventListener('click', function () {
  if (currentscore > 0) {
    if (playing) {
      scores[Activeplayer] += currentscore;
      document.getElementById(`score--${Activeplayer}`).textContent =
        scores[Activeplayer];
      if (scores[Activeplayer] >= 101) {
        playing = false;
        win[Activeplayer]++;
        document.getElementById(`wintimes-${Activeplayer}`).textContent =` ( ${win[Activeplayer]} )`;
        diceEL.classList.add('hidden');
        document.getElementById(`current--${Activeplayer}`).textContent = 0;
        document
          .querySelector(`.player--${Activeplayer}`)
          .classList.add('player--winner');
        document
          .querySelector(`.player--${Activeplayer}`)
          .classList.remove('player--active');
      } else {
        switchplayer();
      }
    }
  }
});

btnnew.addEventListener('click', initialpoint);
