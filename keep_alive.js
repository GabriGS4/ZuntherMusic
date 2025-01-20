const express = require("express");
const app = express();

// Ruta para verificar que el bot está activo
app.get("/", (req, res) => {
    res.send("¡El bot está funcionando!");
});

// Puerto para el servidor
const PORT = 8080;
app.listen(PORT, () => console.log(`Servidor Express ejecutándose en el puerto ${PORT}`));
