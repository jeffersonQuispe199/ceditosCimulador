document.getElementById('formularioLogin').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const usuarioCorrecto = "admin";
    const claveCorrecta = "1234";

    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');

    if (user === usuarioCorrecto && pass === claveCorrecta) {
        window.location.href = 'index2.html'; // Redirige si es correcto
    } else {
        mensaje.textContent = "Usuario o contraseña incorrectos";
        mensaje.style.color = "red";
    }
});