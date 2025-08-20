#ventana + UI
# main.py
import os
import sys
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QListWidget, QFileDialog, QLineEdit, QLabel, QSlider, QMessageBox, QListWidgetItem
)
from PySide6.QtCore import Qt
from music_player import MusicPlayer

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Mi Reproductor MP3")
        self.resize(700, 500)

        # ---- Backend ----
        self.player = MusicPlayer()

        # ---- UI ----
        central = QWidget()
        self.setCentralWidget(central)

        layout = QVBoxLayout(central)

        # Lista de reproducción
        self.list_widget = QListWidget()
        layout.addWidget(self.list_widget)

        # Controles de reproducción
        controls = QHBoxLayout()
        self.btn_prev = QPushButton("⏮️ Anterior")
        self.btn_play = QPushButton("▶️ Play/Pausa")
        self.btn_next = QPushButton("⏭️ Siguiente")
        self.btn_stop = QPushButton("⏹️ Stop")
        controls.addWidget(self.btn_prev)
        controls.addWidget(self.btn_play)
        controls.addWidget(self.btn_next)
        controls.addWidget(self.btn_stop)
        layout.addLayout(controls)

        # Volumen
        vol_layout = QHBoxLayout()
        vol_layout.addWidget(QLabel("Volumen"))
        self.slider_vol = QSlider(Qt.Horizontal)
        self.slider_vol.setRange(0, 100)
        self.slider_vol.setValue(80)
        vol_layout.addWidget(self.slider_vol)
        layout.addLayout(vol_layout)

        # Cargar archivos locales
        self.btn_add_files = QPushButton("➕ Añadir canciones locales")
        layout.addWidget(self.btn_add_files)

        # Descarga desde URL
        dl_layout = QHBoxLayout()
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("Pega un enlace (p. ej. YouTube) para descargar MP3…")
        self.btn_download = QPushButton("⬇️ Descargar MP3")
        dl_layout.addWidget(self.url_input, 3)
        dl_layout.addWidget(self.btn_download, 1)
        layout.addLayout(dl_layout)

        # ---- Conexiones ----
        self.btn_add_files.clicked.connect(self.add_files)
        self.btn_play.clicked.connect(self.player.play_or_pause)
        self.btn_stop.clicked.connect(self.player.stop)
        self.btn_next.clicked.connect(self.next_track)
        self.btn_prev.clicked.connect(self.prev_track)
        self.slider_vol.valueChanged.connect(self.player.set_volume)
        self.list_widget.itemDoubleClicked.connect(self.play_selected)
        self.btn_download.clicked.connect(self.download_from_url)

    # --- Slots ---
    def add_files(self):
        files, _ = QFileDialog.getOpenFileNames(
            self, "Seleccionar canciones", "", "Audio (*.mp3 *.wav *.flac)"
        )
        if not files:
            return
        # Añadir al backend y a la UI
        self.player.add(files)
        for full_path in files:
            item = QListWidgetItem(os.path.basename(full_path))
            item.setData(Qt.UserRole, full_path)  # guarda la ruta completa
            self.list_widget.addItem(item)

    def play_selected(self, item: QListWidgetItem):
        idx = self.list_widget.row(item)
        self.player.play_index(idx)

    def next_track(self):
        self.player.next()
        # Opcional: resaltar en la UI el siguiente índice

    def prev_track(self):
        self.player.previous()

    def download_from_url(self):
        url = self.url_input.text().strip()
        if not url:
            QMessageBox.warning(self, "Aviso", "Pega un enlace válido.")
            return
        self.btn_download.setEnabled(False)
        self.btn_download.setText("Descargando…")
        try:
            # For now, show a message that this feature requires the API server
            QMessageBox.information(self, "Información", 
                "Para descargar desde URL, usa la interfaz web React.\n"
                "Ejecuta 'python api_server.py' y abre http://localhost:3000")
            return
        finally:
            self.btn_download.setEnabled(True)
            self.btn_download.setText("⬇️ Descargar MP3")
            self.url_input.clear()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    w = MainWindow()
    w.show()
    sys.exit(app.exec())
