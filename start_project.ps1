# Start PHP Backend
Start-Process -FilePath "php" -ArgumentList "-S 127.0.0.1:8000 -t backend -c php.ini" -NoNewWindow

# Start React Frontend
Set-Location frontend
npm run dev
