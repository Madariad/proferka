 // Запрашиваем доступ к микрофону
 navigator.mediaDevices.getUserMedia({ audio: true, video: false })
 .then((stream) => {
   const audioContext = new AudioContext();
   const analyser = audioContext.createAnalyser();
   const microphone = audioContext.createMediaStreamSource(stream);
   microphone.connect(analyser);
   analyser.fftSize = 256;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   // Функция для обновления громкости
   function updateVolume() {
     analyser.getByteFrequencyData(dataArray);

     // Вычисляем среднюю громкость
     let sum = 0;
     for(let i = 0; i < bufferLength; i++) {
       sum += dataArray[i];
     }
     let averageVolume = sum / bufferLength;

     // Обновляем значение громкости на странице
     document.getElementById('volume').textContent = 'Громкость: ' + averageVolume;

     // Повторяем функцию каждые 100 миллисекунд
     setTimeout(updateVolume, 100);
   }

   // Запускаем функцию обновления громкости
   updateVolume();
 })
 .catch((error) => {
   console.error('Ошибка при получении медиа-потока:', error);
 });
 