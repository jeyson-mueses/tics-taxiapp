// Simulación de base de datos
let users = [];
let reservations = [];
let currentUser = null;

function toggleForms() {
  document.getElementById("loginForm").classList.toggle("hidden");
  document.getElementById("signupForm").classList.toggle("hidden");
}

function login(event) {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    showDashboard();
  } else {
    alert("Correo o contraseña incorrectos");
  }
}

function signup(event) {
  event.preventDefault();
  const name = event.target[0].value;
  const email = event.target[1].value;
  const password = event.target[2].value;
  const confirmPassword = event.target[3].value;

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return false;
  }

  if (users.some((u) => u.email === email)) {
    alert("El correo ya está registrado");
    return false;
  }

  users.push({ name, email, password });
  alert("Registro exitoso");
  toggleForms();
  return false;
}

function showDashboard() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  updateReservationsList();
}

function logout() {
  currentUser = null;
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function bookTaxi(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const reservation = {
    id: Date.now(),
    user: currentUser.email,
    phone: formData.get("tel"),
    date: formData.get("date"),
    time: formData.get("time"),
    passengers: formData.get("passengers"),
    vehicleType: formData.get("vehicleType"),
    pickup: formData.get("pickup"),
    destination: formData.get("destination"),
    notes: formData.get("notes"),
    driver: formData.get("driver"),
  };

  reservations.push(reservation);
  event.target.reset();
  updateReservationsList();
  alert("Reserva confirmada");

  return false;
}

function deleteReservation(id) {
  reservations = reservations.filter((r) => r.id !== id);
  updateReservationsList();
}

function updateReservationsList() {
  const reservationsList = document.getElementById("reservationsList");
  const userReservations = reservations.filter(
    (r) => r.user === currentUser.email
  );

  reservationsList.innerHTML = userReservations
    .map(
      (r) => `
        <div class="reservation-card">
            <p>📅 Fecha: ${r.date}</p>
            <p>⏰ Hora: ${r.time}</p>
            <p>📍 Origen: ${r.pickup}</p>
            <p>🎯 Destino: ${r.destination}</p>
            <p>👥 Pasajeros: ${r.passengers}</p>
            <p>🚗 Vehículo: ${r.vehicleType}</p>
            <p>📞 Teléfono: ${r.phone}</p>
            ${r.notes ? `<p>📝 Notas: ${r.notes}</p>` : ""}
            <p><strong>⏳ Tu taxi viene en:</strong> <span id="countdown-${r.id}">Calculando...</span></p>
            <button onclick="deleteReservation(${r.id})" class="delete-reservation">
                Cancelar Reserva ❌
            </button>
        </div>
    `
    )
    .join("");

  userReservations.forEach((r) => startCountdown(`countdown-${r.id}`, r.date, r.time));
}

function startCountdown(elementId, date, time) {
  const countdownElement = document.getElementById(elementId);
  const targetTime = new Date(`${date}T${time}`).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetTime - now;
    if (timeLeft <= 0) {
      countdownElement.innerText = "¡Tu taxi ha llegado!";
      return;
    }
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    countdownElement.innerText = `${minutes}m ${seconds}s`;
    setTimeout(updateCountdown, 1000);
  }

  updateCountdown();
}
