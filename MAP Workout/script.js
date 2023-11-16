'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

///////////////
const editAllbtn = document.querySelector('.editAll__btn');
const deleteAllbtn = document.querySelector('.deleteAll__btn');

// let map, mapEvent;
////////////////////--------------
/// class Workout
class Workout {
  date = new Date();
  id = Date.now() + ''.slice(-10);

  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  _click() {
    this.clicks++;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevatinGain) {
    super(coords, distance, duration);
    this.elevatinGain = elevatinGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////--------------------
///////// class App
class App {
  #map;
  #mapZoomView = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getLocalStorage();
    this._getPosition();
    ///eventLestener
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    const deletebtn = document.querySelectorAll('.delete__btn');
    deletebtn.forEach(btn =>
      btn.addEventListener('click', this._deleteEl.bind(this))
    );
  }

  ///////////////// Methodes:---->
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not Get Your Location');
        }
      );
    }
  }

  _deleteEl(e) {
    const targetEl = e.target.closest('.workout');
    console.log(targetEl);
    targetEl.style.display = 'none';
    // targetEl.classList.add('hiddenbtn');
  }

  _loadMap(position) {
    // console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(latitude, longitude);
    // console.log(
    //   `https://www.google.com/maps/@${latitude},${longitude},16.76z?entry=ttu`
    // );
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomView);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
    this.#workouts.forEach(work => {
      this._renderMapMarker(work);
      this.#map.setView(coords, this.#mapZoomView);
    });
  }

  _showForm(mapEV) {
    this.#mapEvent = mapEV;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    const isNUM = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const isPositive = (...inputs) => inputs.every(inp => inp > 0);
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //// running
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !isNUM(distance, duration, cadence) ||
        !isPositive(distance, duration, cadence)
      ) {
        return alert('Enter a valid input.. :)');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    ///// cycling
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !isNUM(distance, duration, elevation) ||
        !isPositive(distance, duration)
      ) {
        return alert('Enter a valid input.. :)');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    ///// push new workout to workouts array:
    this.#workouts.push(workout);
    //////// renderMapMarker:
    this._renderMapMarker(workout);
    this._renderWorkoutForm(workout);
    this._hideForm();
    this._setLocalStorage();
    /////////
  }
  _renderMapMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}}`
      )
      .openPopup();
  }
  _renderWorkoutForm(workout) {
    let html = `
    
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}<span>
    <button class="delete__btn delete hiddenbtn">delete</button></span></h2>
   
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
      
    `;
    if (workout.type === 'running') {
      html += `</div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;
    }
    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevatinGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
    ////////
    const deletebtn = document.querySelectorAll('.delete__btn');

    editAllbtn.addEventListener('click', function (e) {
      deleteAllbtn.classList.remove('hiddenbtn');
      deletebtn.forEach(btn => btn.classList.remove('hiddenbtn'));
    });
    deleteAllbtn.addEventListener('click', function (e) {
      e.preventDefault();	
      localStorage.removeItem('workouts');
      location.reload();
    });

    deleteAllbtn.classList.add('hiddenbtn');
    deletebtn.forEach(btn => btn.classList.add('hiddenbtn'));
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    /////
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    /////////
    this.#map.setView(workout.coords, this.#mapZoomView, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    // workout._click();
    // console.log(workout);
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkoutForm(work);
    });
  }
  _reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();

///////////////////// draft

// console.log(new Date(),Date.now()+''.slice(-10));
// const isNUM=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));
// console.log(isNUM(15,'h'));
// console.log([5,5].every(inp => inp>0));
