import sys
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QPushButton, QVBoxLayout,
    QLabel, QFileDialog, QHBoxLayout
)
from PySide6.QtCore import Qt


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🎵 Music Player")
        self.setGeometry(200, 200, 400, 200)

        # Label para mostrar el nombre de la canción
        self.song_label = QLabel("No hay canción cargada")
        self.song_label.setAlignment(Qt.AlignCenter)

        # Botón para cargar una canción
        self.load_button = QPushButton("Cargar canción")
        self.load_button.clicked.connect(self.load_song)

        # Botones de control
        self.play_button = QPushButton("▶️ Play")
        self.pause_button = QPushButton("⏸️ Pausa")
        self.stop_button = QPushButton("⏹️ Stop")

        # Layout para botones de control
        controls_layout = QHBoxLayout()
        controls_layout.addWidget(self.play_button)
        controls_layout.addWidget(self.pause_button)
        controls_layout.addWidget(self.stop_button)

        # Layout principal
        layout = QVBoxLayout()
        layout.addWidget(self.song_label)
        layout.addWidget(self.load_button)
        layout.addLayout(controls_layout)

        # Contenedor central
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        # Aquí guardaremos la ruta de la canción seleccionada
        self.current_song = None

    def load_song(self):
        file_dialog = QFileDialog(self)
        file_dialog.setNameFilter("Archivos de audio (*.mp3 *.wav *.flac)")
        if file_dialog.exec():
            file_path = file_dialog.selectedFiles()[0]
            self.current_song = file_path
            self.song_label.setText(f"🎶 {file_path.split('/')[-1]}")


# Solo para probar esta ventana directamente
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
