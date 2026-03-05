<b>NeoDash</b><br>
Homeserver Dashboard das einfach funktioniert.<br>
<br>
<img width="1157" height="519" alt="grafik" src="https://github.com/user-attachments/assets/8508d627-bc42-4637-a256-e0ee3f9eb6ef" /><br>
<br>
<img width="477" height="812" alt="grafik" src="https://github.com/user-attachments/assets/8b18c8c3-0997-4585-ac34-8b87edc83776" /><br>
<br>
<b>Schnellstart</b><br>
Docker Compose:<br>
<pre>
services:
  neodash:
    image: neodash:2.2
    container_name: neodash
    ports:
      - "9020:3000"
    volumes:
      - data:/app/data #einstellungen
      - uploads:/app/public/uploads #uploads hintergrund, icons
    restart: unless-stopped

volumes:
  data:
  uploads:
  </pre>
